#!/bin/bash
set -e

echo "Creating TaskHub DB dump..."

DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_HOST=${DB_HOST}

mkdir -p ./dumps

export PGPASSWORD=$DB_PASSWORD

pg_dump -h $DB_HOST -p 5432 --no-owner -Fc -U $DB_USER $DB_NAME -f ./dumps/taskhub_db.custom

echo "TaskHub DB dump created at ./dumps/taskhub_db.custom"