Param($Path)
Get-ChildItem -Path $Path -Include *.js -Recurse | % { 
	.\compiler\compiler.exe --js $_.FullName --js_output_file ($_.FullName -replace "\\proto\\", "\\__build\\proto\\") --charset=UTF-8
}