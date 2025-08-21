from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import json
from datetime import datetime
import logging
from pathlib import Path
import os

from backend.scraper.scraper import PenzGTUAbiturScraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PenzGTU Applicant Monitoring API",
    description="API for monitoring graduate admission lists at PenzGTU",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("backend/data")
SESSIONS_DIR = DATA_DIR / "sessions"
LATEST_FILE = DATA_DIR / "latest.json"
CONFIG_FILE = DATA_DIR / "config" / "directions.json"


def load_json_file(filepath: Path) -> Optional[Dict]:
    try:
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return None
    except Exception as e:
        logger.error(f"Error loading file {filepath}: {e}")
        return None


def get_session_files() -> List[Dict]:
    sessions = []
    if SESSIONS_DIR.exists():
        for file_path in SESSIONS_DIR.glob("session_*.json"):
            try:
                timestamp_str = file_path.stem.replace("session_", "")
                timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
                sessions.append(
                    {
                        "filename": file_path.name,
                        "timestamp": timestamp.isoformat(),
                        "path": str(file_path),
                    }
                )
            except ValueError:
                continue

    # Sort sessions by timestamp (newest first)
    sessions.sort(key=lambda x: x["timestamp"], reverse=True)
    return sessions


@app.get("/")
async def root():
    return {"message": "PenzGTU Applicant Monitoring API", "version": "1.0.0"}


@app.get("/api/config")
async def get_config():
    config = load_json_file(CONFIG_FILE)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config


@app.post("/api/scrape")
async def run_scraping():
    try:
        logger.info("Starting scraping via API")
        scraper = PenzGTUAbiturScraper()
        filepath = scraper.run_scraping_session()

        if not filepath:
            raise HTTPException(status_code=500, detail="Error during scraping")

        return {
            "message": "Scraping completed successfully",
            "filepath": filepath,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error during scraping: {e}")
        raise HTTPException(status_code=500, detail=f"Error during scraping: {str(e)}")


@app.get("/api/sessions")
async def get_sessions():
    sessions = get_session_files()
    return {"sessions": sessions, "total": len(sessions)}


@app.get("/api/sessions/{timestamp}")
async def get_session(timestamp: str):
    try:
        session_file = SESSIONS_DIR / f"session_{timestamp}.json"
        session_data = load_json_file(session_file)

        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")

        return session_data
    except Exception as e:
        logger.error(f"Error getting session {timestamp}: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting session: {str(e)}")


@app.get("/api/latest")
async def get_latest():
    latest_data = load_json_file(LATEST_FILE)
    if not latest_data:
        raise HTTPException(status_code=404, detail="Latest data not found")
    return latest_data


@app.get("/api/compare/{timestamp1}/{timestamp2}")
async def compare_sessions(timestamp1: str, timestamp2: str):
    try:
        session1_file = SESSIONS_DIR / f"session_{timestamp1}.json"
        session2_file = SESSIONS_DIR / f"session_{timestamp2}.json"

        session1 = load_json_file(session1_file)
        session2 = load_json_file(session2_file)

        if not session1 or not session2:
            raise HTTPException(
                status_code=404, detail="One or both sessions not found"
            )

        # Analyze changes
        changes = {"timestamp1": timestamp1, "timestamp2": timestamp2, "directions": {}}

        for direction_id in session1.get("directions", {}):
            if direction_id in session2.get("directions", {}):
                dir1 = session1["directions"][direction_id]
                dir2 = session2["directions"][direction_id]

                # Compare number of applicants
                applicants1 = dir1.get("applicants", [])
                applicants2 = dir2.get("applicants", [])

                codes1 = {app["unique_code"] for app in applicants1}
                codes2 = {app["unique_code"] for app in applicants2}

                new_applicants = codes2 - codes1
                removed_applicants = codes1 - codes2

                changes["directions"][direction_id] = {
                    "direction_name": dir1.get("direction_name", ""),
                    "total_before": len(applicants1),
                    "total_after": len(applicants2),
                    "new_applicants": list(new_applicants),
                    "removed_applicants": list(removed_applicants),
                    "change": len(applicants2) - len(applicants1),
                }

        return changes
    except Exception as e:
        logger.error(f"Error comparing sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")


@app.get("/api/applicant/{code}")
async def find_applicant(code: str):
    latest_data = load_json_file(LATEST_FILE)
    if not latest_data:
        raise HTTPException(status_code=404, detail="Data not found")

    results = []
    for direction_id, direction_data in latest_data.get("directions", {}).items():
        if "applicants" in direction_data:
            for applicant in direction_data["applicants"]:
                if applicant["unique_code"] == code:
                    results.append(
                        {
                            "direction_id": direction_id,
                            "direction_name": direction_data.get("direction_name", ""),
                            "direction_code": direction_data.get("direction_code", ""),
                            "applicant": applicant,
                        }
                    )

    if not results:
        raise HTTPException(status_code=404, detail="Applicant not found")

    return {"applicant_code": code, "found_in": results}


@app.get("/api/statistics")
async def get_statistics():
    latest_data = load_json_file(LATEST_FILE)
    if not latest_data:
        raise HTTPException(status_code=404, detail="Data not found")

    stats = {
        "timestamp": latest_data.get("timestamp"),
        "total_directions": latest_data.get("total_directions", 0),
        "total_applicants": 0,
        "unique_applicants": set(),
        "directions_stats": {},
    }

    for direction_id, direction_data in latest_data.get("directions", {}).items():
        if "applicants" in direction_data:
            applicants = direction_data["applicants"]
            stats["total_applicants"] += len(applicants)

            for applicant in applicants:
                stats["unique_applicants"].add(applicant["unique_code"])

            stats["directions_stats"][direction_id] = {
                "name": direction_data.get("direction_name", ""),
                "code": direction_data.get("direction_code", ""),
                "total_applications": len(applicants),
                "available_places": direction_data.get("available_places", 0),
                "with_consent": len(
                    [a for a in applicants if a.get("consent") == "Есть"]
                ),
                "without_consent": len(
                    [a for a in applicants if a.get("consent") == "Нет"]
                ),
            }

    stats["unique_applicants_count"] = len(stats["unique_applicants"])
    stats["unique_applicants"] = list(stats["unique_applicants"])

    return stats


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
