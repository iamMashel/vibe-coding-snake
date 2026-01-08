.PHONY: dev test verify clean install help

help:
	@echo "Available commands:"
	@echo "  make dev      - Start the development server"
	@echo "  make test     - Run tests"
	@echo "  make verify   - Verify API endpoints against running server"
	@echo "  make install  - Install dependencies"
	@echo "  make clean    - Clean cache and temporary files"

dev:
	uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

test:
	uv run pytest tests_integration/ -v

test-unit:
	uv run pytest tests_integration/test_general.py -v

test-integration:
	uv run pytest tests_integration/test_*_integration.py -v

verify:
	uv run python verify_api.py

install:
	uv sync

clean:
	rm -rf __pycache__ .pytest_cache .venv
	find . -type d -name "__pycache__" -exec rm -rf {} +
