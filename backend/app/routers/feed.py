from fastapi import APIRouter
import feedparser

router = APIRouter()


@router.get("/feed/news")
def get_financial_news():
    """
    Retrieve the latest financial news headlines from MarketWatch.

    Returns:
        List[str]: A list of the top 10 news headline titles from the RSS feed.
    """
    feed = feedparser.parse("https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines")
    return [entry.title for entry in feed.entries[:10]]
