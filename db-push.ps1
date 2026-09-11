$env:PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION = "Yes, go ahead - reset and rebuild dev.db"
node_modules\.bin\prisma db push --accept-data-loss
