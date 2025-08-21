import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import json
import re
from datetime import datetime
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class PenzGTUAbiturScraper:
    def __init__(self, config_path: str = "data/config/directions.json"):
        self.config_path = config_path
        self.directions = self._load_config()
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
            }
        )

    def _load_config(self) -> List[Dict]:
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                return config["directions"]
        except FileNotFoundError:
            logger.error(f"Configuration file {self.config_path} not found")
            return []
        except json.JSONDecodeError:
            logger.error(f"JSON parsing error in file {self.config_path}")
            return []

    def _clean_text(self, text: str) -> str:
        if not text:
            return ""
        return re.sub(r"\s+", " ", text.strip())

    def _parse_applicant_row(self, row) -> Optional[Dict]:
        try:
            cells = row.find_all("td")
            if len(cells) < 8:
                return None

            position = self._clean_text(cells[0].get_text())
            unique_code = self._clean_text(cells[1].get_text())
            consent = self._clean_text(cells[2].get_text())
            sd_score = self._clean_text(cells[3].get_text())
            lang_score = self._clean_text(cells[4].get_text())
            achievements = self._clean_text(cells[5].get_text())
            additional = self._clean_text(cells[6].get_text())
            priority = self._clean_text(cells[7].get_text())
            total_score = (
                self._clean_text(cells[8].get_text()) if len(cells) > 8 else "---"
            )

            return {
                "position": int(position) if position.isdigit() else 0,
                "unique_code": unique_code,
                "consent": consent,
                "sd_score": sd_score,
                "lang_score": lang_score,
                "achievements": achievements,
                "additional": additional,
                "priority": int(priority) if priority.isdigit() else 0,
                "total_score": total_score,
            }
        except Exception as e:
            logger.error(f"Error parsing applicant row: {e}")
            return None

    def _extract_direction_info(self, soup: BeautifulSoup) -> Dict:
        info = {}

        title_elem = soup.find("h2", class_="title")
        if title_elem:
            info["name"] = self._clean_text(title_elem.get_text())

        info_section = soup.find("div", class_="directions_bold-and-text")
        if info_section:
            descriptions = info_section.find_all("p", class_="description")
            for desc in descriptions:
                text = desc.get_text()
                if "Поданных заявлений:" in text:
                    match = re.search(r"Поданных заявлений:\s*(\d+)", text)
                    if match:
                        info["total_applications"] = int(match.group(1))
                elif "Количество мест:" in text:
                    match = re.search(r"Количество мест:\s*(\d+)", text)
                    if match:
                        info["available_places"] = int(match.group(1))
                elif "Форма обучения:" in text:
                    match = re.search(r"Форма обучения:\s*(.+)", text)
                    if match:
                        info["form"] = self._clean_text(match.group(1))
                elif "Основа обучения:" in text:
                    match = re.search(r"Основа обучения:\s*(.+)", text)
                    if match:
                        info["funding_type"] = self._clean_text(match.group(1))

        return info

    def scrape_direction(self, direction: Dict) -> Dict:
        logger.info(f"Scraping direction: {direction['name']}")

        try:
            response = self.session.get(direction["url"], timeout=10)
            response.raise_for_status()
            response.encoding = "utf-8"

            soup = BeautifulSoup(response.text, "html.parser")

            # Extract direction information
            direction_info = self._extract_direction_info(soup)

            # Find applicants table
            table_body = soup.find("tbody", id="abitTable")
            applicants = []

            if table_body:
                rows = table_body.find_all("tr")
                for row in rows:
                    applicant = self._parse_applicant_row(row)
                    if applicant:
                        applicants.append(applicant)

            result = {
                "direction_id": direction["id"],
                "direction_code": direction["code"],
                "direction_name": direction["name"],
                "url": direction["url"],
                **direction_info,
                "applicants": applicants,
                "scraped_at": datetime.now().isoformat(),
            }

            logger.info(
                f"Found {len(applicants)} applicants for direction {direction['code']}"
            )
            return result

        except requests.RequestException as e:
            logger.error(f"Request error for {direction['url']}: {e}")
            return {
                "direction_id": direction["id"],
                "direction_code": direction["code"],
                "direction_name": direction["name"],
                "url": direction["url"],
                "error": str(e),
                "scraped_at": datetime.now().isoformat(),
            }
        except Exception as e:
            logger.error(f"General error while scraping {direction['url']}: {e}")
            return {
                "direction_id": direction["id"],
                "direction_code": direction["code"],
                "direction_name": direction["name"],
                "url": direction["url"],
                "error": str(e),
                "scraped_at": datetime.now().isoformat(),
            }

    def scrape_all_directions(self) -> Dict:
        logger.info(f"Starting scraping of {len(self.directions)} directions...")

        session_data = {
            "timestamp": datetime.now().isoformat(),
            "total_directions": len(self.directions),
            "directions": {},
        }

        for direction in self.directions:
            result = self.scrape_direction(direction)
            session_data["directions"][direction["id"]] = result

        return session_data

    def save_session(self, session_data: Dict, filename: Optional[str] = None) -> str:
        if not filename:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"session_{timestamp}.json"

        sessions_dir = "data/sessions"
        os.makedirs(sessions_dir, exist_ok=True)

        filepath = os.path.join(sessions_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(session_data, f, ensure_ascii=False, indent=2)

        latest_path = "data/latest.json"
        with open(latest_path, "w", encoding="utf-8") as f:
            json.dump(session_data, f, ensure_ascii=False, indent=2)

        logger.info(f"Data saved to {filepath} and {latest_path}")
        return filepath

    def run_scraping_session(self) -> str:
        logger.info("=== Starting PenzGTU scraping session ===")

        if not self.directions:
            logger.warning("No directions to scrape")
            return ""

        session_data = self.scrape_all_directions()
        filepath = self.save_session(session_data)

        total_applicants = 0
        successful_directions = 0

        for direction_data in session_data["directions"].values():
            if "applicants" in direction_data:
                total_applicants += len(direction_data["applicants"])
                successful_directions += 1

        logger.info("\n=== Session Results ===")
        logger.info(
            f"Successfully processed directions: {successful_directions}/{len(self.directions)}"
        )
        logger.info(f"Total applicants found: {total_applicants}")
        logger.info(f"Data saved to: {filepath}")

        return filepath


if __name__ == "__main__":
    scraper = PenzGTUAbiturScraper()
    scraper.run_scraping_session()
