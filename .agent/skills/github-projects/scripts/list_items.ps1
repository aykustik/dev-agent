<#
.SYNOPSIS
Listet alle Items (Tasks) eines GitHub Projects auf.
.DESCRIPTION
Zeigt ID, Titel und Status aller Items.
.PARAMETER ProjectID
GitHub Project ID
.EXAMPLE
pwsh ./list_items.ps1 -ProjectID 1
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
# Items abrufen
# -----------------------------
try {
    $itemsJson = gh project item-list $ProjectID --json id,title,status | ConvertFrom-Json
} catch {
    Write-Error "❌ Fehler beim Abrufen der Items: $_"
    exit 1
}

# -----------------------------
# Items ausgeben
# -----------------------------
if ($itemsJson.Count -eq 0) {
    Write-Output "ℹ️ Keine Items im Projekt gefunden."
} else {
    Write-Output "🔹 Items in Project $ProjectID:"
    Write-Output "========================================"
    foreach ($item in $itemsJson) {
        Write-Output "ID     : $($item.id)"
        Write-Output "Titel  : $($item.title)"
        Write-Output "Status : $($item.status)"
        Write-Output "========================================"
    }
}
