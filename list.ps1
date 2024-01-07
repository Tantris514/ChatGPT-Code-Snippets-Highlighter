

$files = Get-ChildItem -Recurse



foreach ($file in $files) {
    try {
        if ($file.Extension -eq ".png") {
            Write-Host "Skipping PNG file: $($file.FullName)"
        }
        else {
            Write-Host "File: $($file.FullName)"
            Get-Content $file.FullName
        }
        
    }
    catch {

        write-host ""
    }

}
