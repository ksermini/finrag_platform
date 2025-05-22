from fastapi import APIRouter
import feedparser

router = APIRouter()

@router.get("/feed/news")
def get_financial_news():
    feed = feedparser.parse("https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines")
    return [entry.title for entry in feed.entries[:10]]
