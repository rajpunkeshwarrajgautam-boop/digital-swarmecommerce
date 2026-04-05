# 🚀 DIGITAL SWARM | Asset Packaging Protocol (V2.0)
# ----------------------------------------------------

$assetsDir = "digital_assets"
$outputDir = "public/downloads"

Clear-Host
Write-Host "🛸 [SWARM PACKAGING] Protocol Initiated..." -ForegroundColor Cyan

# 🔍 CHECK SOURCE DIRECTORY
if (!(Test-Path $assetsDir)) {
    Write-Error "[CRITICAL] Source directory not found: $assetsDir"
    exit 1
}

# 📁 PREPARE OUTPUT
if (!(Test-Path $outputDir)) {
    Write-Host "Creating output directory: $outputDir" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# 🛠️ DEFINE MAPPINGS
$mappings = @{
    "Swarm_Sales_Infiltrator" = "swarm-sales-infiltrator.zip"
    "Swarm_Finance_Agent" = "swarm-finance-agent.zip"
    "Swarm_Cinema_Infiltrator" = "swarm-cinema-infiltrator.zip"
    "Sentinel_Research_Infiltrator" = "sentinel-research-infiltrator.zip"
    "Elite_Legal_Protocol" = "swarm-legal-optimized.zip"
    "Elite_Recruitment_Protocol" = "swarm-talent-optimized.zip"
    "Digital_Marketing_Protocol" = "sentinel-seo-optimized.zip"
    "Elite_Real_Estate_Protocol" = "swarm-property-optimized.zip"
    "Elite_SaaS_Protocol" = "swarm-uiux-auditor.zip"
    "Elite_Freelance_CRM" = "notion-crm-protocol.zip"
    "Elite_Social_Automation" = "ai-social-protocol.zip"
    "Elite_Cyberpunk_UI" = "cyberpunk-ui-protocol.zip"
    "Elite_Executive_Playbook" = "ai-executive-playbook.zip"
    "Elite_Healthcare_Protocol" = "swarm-voice.zip"
    "Elite_Copywriting_Protocol" = "swarm-content-architect.zip"
    "Elite_Ecommerce_Protocol" = "ai-services-agency.zip"
    "Elite_Home_Services" = "sentinel-voyager.zip"
    "Elite_Video_Creation" = "swarm-video-gen.zip"
}

$total = $mappings.Count
$count = 0

foreach ($folder in $mappings.Keys) {
    $count++
    $source = Join-Path $assetsDir $folder
    $dest = Join-Path $outputDir $mappings[$folder]
    
    Write-Host "[Processing $count/$total] $folder..." -ForegroundColor DarkCyan
    
    if (Test-Path $source) {
        if (Test-Path $dest) {
            Write-Host "   → Overwriting existing archive: $($mappings[$folder])" -ForegroundColor DarkGray
            Remove-Item $dest -Force
        }
        
        try {
            Compress-Archive -Path "$source\*" -DestinationPath $dest -ErrorAction Stop
            Write-Host "   ✅ SUCCESS: $($mappings[$folder])" -ForegroundColor Green
        } catch {
            Write-Error "   ❌ FAILED to zip $($folder): $($_.Exception.Message)"
            exit 1
        }
    } else {
        Write-Warning "   ⚠️  FOLDER NOT FOUND: $source (Skipping)"
    }
}

# 📑 HANDLE LEGAL ASSETS
$legalSource = "public/downloads/swarm-legal-optimized.html"
if (Test-Path $legalSource) {
    Write-Host "[Success] Legal asset verified at $legalSource" -ForegroundColor Green
} else {
    Write-Warning "⚠️  Legal asset missing at $legalSource"
}

Write-Host "`n✅ [COMPLETE] All assets are ready for distribution." -ForegroundColor White -BackgroundColor DarkGreen
