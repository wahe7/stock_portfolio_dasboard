import sys
import yfinance as yf
import json

symbols = sys.argv[1:]

results = {}
for symbol in symbols:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        results[symbol] = {"sector":info["sector"], "cmp":info["currentPrice"], "recommendation":info["recommendationKey"], "name":info["shortName"], "pe":info["trailingPE"]}
    except Exception as e:
        print(e)
        results[symbol] = None

print(json.dumps(results))
