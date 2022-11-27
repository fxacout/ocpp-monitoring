FROM python:3.8.15-bullseye

WORKDIR /code

ENV FLASK_APP=src/app.py
ENV FLASK_RUN_HOST=0.0.0.0

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

EXPOSE 3000

COPY . .

CMD ["flask", "run", "--port=3000"]