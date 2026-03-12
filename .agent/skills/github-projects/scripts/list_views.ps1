<#
.SYNOPSIS
Listet alle Views eines GitHub Projects auf.
.DESCRIPTION
Zeigt ID, Name und Typ jeder View.
.PARAMETER ProjectID
GitHub Project ID
.EXAMPLE
pwsh ./list_views.ps1 -ProjectID 1
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectID
)

# -----------------------------
# Prüfung: GitHub CLI installiert?
# -----------------------------
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "❌ GitHub CLI (gh) ist nicht installiert."
    exit 1
}

# -----------------------------
# Views abrufen
# -----------------------------
try {
    $projectJson = gh project view $ProjectID --json views | ConvertFrom-Json
} catch {
    Write-Error "❌ Fehler beim Abrufen der Views: $_"
    exit 1
}

# -----------------------------
# Views ausgeben
# -----------------------------
if ($projectJson.views.Count -eq 0) {
    Write-Output "ℹ️ Keine Views im Projekt gefunden."
} else {
    Write-Output "🔹 Views für Project ID $ProjectID:"
    Write-Output "----------------------------------------"
    foreach ($view in $projectJson.views) {
        Write-Output "View-ID   : $($view.id)"
        Write-Output "Name      : $($view.name)"
        Write-Output "Typ       : $($view.type)"
        Write-Output "----------------------------------------"
    }
}
