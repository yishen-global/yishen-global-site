#!/bin/bash
set -e

# ==========================================================
# YISHEN GLOBAL V5.0 - SOVEREIGN DEPLOYMENT PROTOCOL (FIXED)
# ==========================================================

BLUE='\033[0;34m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

REMOTE_USER="root"
REMOTE_HOST="您的服务器IP"
REMOTE_DIR="/var/www/yishenglobal"

echo -e "${BLUE}>>> [COMMAND_TERMINAL]: INITIATING_SOVEREIGN_IGNITION_V5...${NC}"

echo -e "${GOLD}> STAGE_01: HARVESTING_GLOBAL_INTELLIGENCE...${NC}"
python3 scripts/auto_data_harvester.py
echo -e "${BLUE}>> [SUCCESS]: sku-database.json updated${NC}"

echo -e "${GOLD}> STAGE_02: GENERATING_SITEMAP...${NC}"
python3 scripts/generate_sitemap.py
echo -e "${BLUE}>> [SUCCESS]: sitemap.xml manifested${NC}"

echo -e "${GOLD}> STAGE_03: AUDITING_REQUIRED_NODES...${NC}"
REQUIRED_FILES=("sku-database.json" "sitemap.xml" "index.html" "technical-passport.html" "vercel.json")
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   - [VALIDATED]: $file"
  else
    echo -e "${RED}!! [ERROR]: Missing $file${NC}"
    exit 1
  fi
done

echo -e "${GOLD}> STAGE_04: VERCEL_DEPLOY...${NC}"
if command -v vercel >/dev/null 2>&1; then
  vercel --prod --yes || echo -e "${RED}!! [WARNING]: Vercel push failed.${NC}"
else
  echo -e "${RED}!! [WARNING]: vercel CLI not found. Skip cloud deploy.${NC}"
fi

if [[ $REMOTE_HOST != "您的服务器IP" ]]; then
  echo -e "${GOLD}> STAGE_05: RSYNC_MIRROR...${NC}"
  rsync -avz --progress --exclude '.git' --exclude '.DS_Store' ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/
  ssh $REMOTE_USER@$REMOTE_HOST "chown -R www-data:www-data $REMOTE_DIR && find $REMOTE_DIR -type d -exec chmod 755 {} \; && find $REMOTE_DIR -type f -exec chmod 644 {} \;"
  echo -e "${BLUE}>> [MIRROR_SUCCESS]: Physical server calibrated.${NC}"
fi

echo -e "${GOLD}=========================================================="
echo -e "// MISSION_ACCOMPLISHED: V5.0 INTEL CORE ONLINE."
echo -e "// DEPLOY_TIME: $(date)"
echo -e "==========================================================${NC}"
echo "[$(date)] DEPLOYMENT_V5_COMPLETE" >> deployment.log
