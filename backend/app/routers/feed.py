from fastapi import APIRouter
import feedparser

router = APIRouter()

@router.get("/feed/news")
def get_financial_news():
    feed = feedparser.parse("https://www.reutersagency.com/feed/?best-sectors=business&post_type=best")
    return [entry.title for entry in feed.entries[:10]]
