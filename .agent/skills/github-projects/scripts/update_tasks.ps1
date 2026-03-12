<#
.SYNOPSIS
Aktualisiert einen Task im GitHub Project.
.DESCRIPTION
Dieses Skript ermöglicht das Aktualisieren eines einzelnen Tasks über die GitHub CLI.
Felder: Titel, Beschreibung, Status, Priorität, Kategorie, Notes.
.PARAMETER ItemID
Die Item ID des Tasks (findest du mit: gh project item-list PROJECT_ID)
.PARAMETER TITLE
Neuer Titel (optional)
.PARAMETER Description
Neue Beschreibung (optional)
.PARAMETER Status
Neuer Status (z.B. Todo, In Progress, Done)
.PARAMETER Priority
Neue Priorität (optional)
.PARAMETER Category
Neue Kategorie (optional)
.PARAMETER Notes
Neue Notizen (optional)
.EXAMPLE
pwsh ./update_tasks.ps1 -ItemID 1 -Status "Done" -Notes "Abgeschlossen"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ItemID,

    [Parameter(Mandatory=$false)]
    [string]$TITLE,

    [Parameter(Mandatory=$false)]
    [string]$Description,

    [Parameter(Mandatory=$false)]
    [string]$Status,

    [Parameter(Mandatory=$false)]
    [string]$Priority,

    [Parameter(Mandatory=$false)]
    [string]$Category,

    [Parameter(Mandatory=$false)]
    [string]$Notes
)

# -----------------------------
# Prüfung: GitHub CLI installiert?
# -----------------------------
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "❌ GitHub CLI (gh) ist nicht installiert."
    exit 1
}

# -----------------------------
# Argumente vorbereiten
# -----------------------------
$updateArgs = @()

if ($TITLE)       { $updateArgs += "--title `"$TITLE`"" }
if ($Description) { $updateArgs += "--body `"$Description`"" }
if ($Status)      { $updateArgs += "--field `"Status=$Status`"" }
if ($Priority)    { $updateArgs += "--field `"Priority=$Priority`"" }
if ($Category)    { $updateArgs += "--field `"Category=$Category`"" }
if ($Notes)       { $updateArgs += "--note `"$Notes`"" }

# -----------------------------
# Task aktualisieren
# -----------------------------
if ($updateArgs.Count -eq 0) {
    Write-Warning "⚠️ Keine Updates angegeben!"
    exit 0
}

gh project item-edit $ItemID @updateArgs

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Task $ItemID erfolgreich aktualisiert."
} else {
    Write-Error "❌ Fehler beim Aktualisieren von Task $ItemID"
    exit 1
}
