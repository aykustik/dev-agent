<#
.SYNOPSIS
Erstellt mehrere Tasks im GitHub Project.
.DESCRIPTION
Dieses Skript erstellt Tasks über die GitHub CLI. Es liest die Tasks aus dem Parameter oder der Template-Datei.
Felder müssen im GitHub Project definiert sein: Status, Priorität, Kategorie.
.PARAMETER ProjectID
GitHub Project ID (findest du in der URL: github.com/users/USER/projects/ID)
.PARAMETER TemplateFile
Pfad zur Template-Datei (optional)
.EXAMPLE
pwsh ./create_tasks.ps1 -ProjectID 1
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectID,

    [Parameter(Mandatory=$false)]
    [string]$TemplateFile = ""
)

# -----------------------------
# Prüfung: GitHub CLI installiert?
# -----------------------------
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "❌ GitHub CLI (gh) ist nicht installiert. Installiere es zuerst: https://cli.github.com/"
    exit 1
}

# -----------------------------
# Prüfung: Eingeloggt?
# -----------------------------
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Nicht bei GitHub eingeloggt. Führe 'gh auth login' aus."
    exit 1
}

# -----------------------------
# Tasks definieren (Beispiel)
# -----------------------------
# Hinweis: Diese Felder müssen in deinem GitHub Project definiert sein!
$tasks = @(
    @{ TITLE="OpenCode Skill"; DESCRIPTION="OpenCode mit umfassendem Wissen erweitern"; CATEGORY="Skill-Erweiterung"; PRIORITY="High"; STATUS="Todo"; NOTES="Initial Task" },
    @{ TITLE="Skill-Finder"; DESCRIPTION="Existierende Skills identifizieren"; CATEGORY="Skill-Erweiterung"; PRIORITY="Medium"; STATUS="Todo"; NOTES="Überprüfung notwendig" },
    @{ TITLE="Skill-Creator"; DESCRIPTION="Neue Skills entwickeln"; CATEGORY="Feature"; PRIORITY="High"; STATUS="Todo"; NOTES="" }
)

# -----------------------------
# Aus Template-Datei lesen (falls angegeben)
# -----------------------------
if ($TemplateFile -and (Test-Path $TemplateFile)) {
    $content = Get-Content $TemplateFile -Raw
    # Einfaches Parsen: Titel=wert, Description=wert, etc.
    $lines = $content -split "`n"
    $currentTask = @{}
    $tasks = @()

    foreach ($line in $lines) {
        if ($line -match "^Title:\s*(.+)$") { $currentTask.TITLE = $matches[1].Trim() }
        elseif ($line -match "^Description:\s*(.+)$") { $currentTask.DESCRIPTION = $matches[1].Trim() }
        elseif ($line -match "^Priority:\s*(.+)$") { $currentTask.PRIORITY = $matches[1].Trim() }
        elseif ($line -match "^Category:\s*(.+)$") { $currentTask.CATEGORY = $matches[1].Trim() }
        elseif ($line -match "^Status:\s*(.+)$") { $currentTask.STATUS = $matches[1].Trim() }
        elseif ($line -match "^Notes:\s*(.+)$") { $currentTask.NOTES = $matches[1].Trim() }
        elseif ($line -match "^---$" -and $currentTask.TITLE) {
            $tasks += [PSCustomObject]$currentTask
            $currentTask = @{}
        }
    }
    if ($currentTask.TITLE) { $tasks += [PSCustomObject]$currentTask }
}

# -----------------------------
# Tasks erstellen via GitHub CLI
# -----------------------------
foreach ($task in $tasks) {
    $createArgs = @(
        "--title `"$($task.TITLE)`"",
        "--body `"$($task.DESCRIPTION)`""
    )

    # Felder nur hinzufügen wenn definiert
    if ($task.STATUS)   { $createArgs += "--field `"Status=$($task.STATUS)`"" }
    if ($task.PRIORITY) { $createArgs += "--field `"Priority=$($task.PRIORITY)`"" }
    if ($task.CATEGORY) { $createArgs += "--field `"Category=$($task.CATEGORY)`"" }
    if ($task.NOTES)    { $createArgs += "--note `"$($task.NOTES)`"" }

    gh project item-create $ProjectID @createArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Output "✅ Task erstellt: $($task.TITLE)"
    } else {
        Write-Warning "⚠️ Fehler beim Erstellen von: $($task.TITLE)"
    }
}

Write-Output "🎉 Fertig! $($tasks.Count) Tasks erstellt."
