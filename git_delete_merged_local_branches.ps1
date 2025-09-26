# List of protected branches you don't want to delete
$protectedBranches = @('main', '* main', 'master', '* master', 'develop', '* develop')

# Fetch latest and clean up stale references
git fetch --prune

# Get the current branch
$currentBranch = git rev-parse --abbrev-ref HEAD

# Get a list of merged branches
$mergedBranches = git branch --merged | ForEach-Object { $_.Trim() }

foreach ($branch in $mergedBranches) {
    if ($branch -ne $currentBranch -and -not ($protectedBranches -contains $branch)) {
        Write-Host "Deleting merged branch: $branch"
        git branch -d $branch
    }
}