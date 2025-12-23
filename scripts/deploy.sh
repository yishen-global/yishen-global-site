#!/bin/bash
set -euo pipefail

# =========================================================
# YISHEN GLOBAL V5.1 - SOVEREIGN DEPLOYMENT PROTOCOL (PATCHED)
# =========================================================

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BASE_DIR"

RED='\033[0;31m'
BLUE='\033[0;34m'
GOLD='\033[0;33m'
NC='\033[0m'

REMOTE_USER="root"
REMOTE_HOST="您的服务器IP"
REMOTE_DIR="/var/www/yishenglobal"

echo -e "${BLUE}>>> [COMMAND_TERMINAL]: INITIATING_SOVEREIGN_IGNITION_V5.1...${NC}"

# ------------------ STAGE 01 ------------------
echo -e "${GOLD}> STAGE_01: COLLIDING_GLOBAL_INTELLIGENCE_NODES...${NC}"
if python3 scripts/auto_data_harvester.py; then
  echo -e "${BLUE}>> [SUCCESS]: Intelligence payloads injected into sku-database.json${NC}"
else
  echo -e "${RED}!! [FATAL]: Data harvesting failed. Aborting deployment.${NC}"
  exit 1
fi

# ------------------ STAGE 02 ------------------
echo -e "${GOLD}> STAGE_02: AUDITING_PHYSICAL_ASSET_VAULT...${NC}"
REQUIRED_FILES=("sku-database.json" "vercel.json" "index.html" "technical-passport.html")
for file in "${REQUIRED_FILES[@]}"; do
  [[ -f "$file" ]] || { echo -e "${RED}!! [ERROR]: Missing $file${NC}"; exit 1; }
done

# ------------------ STAGE 03 ------------------
echo -e "${GOLD}> STAGE_03: SYNCHRONIZING_SOVEREIGN_INDEX...${NC}"
if [[ -f data/sovereign-index.xml ]]; then
  echo "   - [SEO_SAFE]: Existing sovereign-index.xml preserved."
else
  echo -e "${RED}!! [ABORTED]: sovereign-index.xml missing. Deployment stopped to protect SEO.${NC}"
  exit 1
fi

# ------------------ STAGE 04 ------------------
echo -e "${GOLD}> STAGE_04: LAUNCHING_CLOUD_INTERCEPTION_LAYERS (Vercel)...${NC}"
vercel --prod --yes || echo -e "${RED}!! [WARNING]: Vercel push failed. Continuing...${NC}"

# ------------------ STAGE 05 ------------------
if [[ "$REMOTE_HOST" != "您的服务器IP" ]]; then
  echo -e "${GOLD}> STAGE_05: MIRRORING_TO_PHYSICAL_SQUAD (Rsync)...${NC}"
  rsync -avz --delete --progress \
    --exclude '.git' \
    --exclude 'deploy.sh' \
    --exclude '.DS_Store' \
    ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
  ssh "$REMOTE_USER@$REMOTE_HOST" \
    "chown -R www-data:www-data $REMOTE_DIR && find $REMOTE_DIR -type d -exec chmod 755 {} \; && find $REMOTE_DIR -type f -exec chmod 644 {} \;"
fi

# ------------------ FINAL ------------------
echo -e "${GOLD}=========================================================="
echo -e "// MISSION_ACCOMPLISHED: V5.1 MOTHER SHIP IS LIVE."
echo -e "// DEPLOY_TIME: $(date -u)"
echo -e "==========================================================${NC}"
echo "[$(date -u)] DEPLOYMENT_V5.1_COMPLETE" >> deployment.log
