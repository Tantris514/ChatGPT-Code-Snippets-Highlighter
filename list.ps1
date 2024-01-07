$files = Get-ChildItem -Recurse

foreach ($file in $files) {
    try {
        if ($file.Extension -eq ".png" -or $file.Extension -eq ".css") {
            Write-Host "Skipping $($file.Extension) file: $($file.FullName)"
        }
        else {
            Write-Host "File: $($file.FullName)"
            Get-Content $file.FullName
        }
    }
    catch {
        Write-Host ""
    }
}
