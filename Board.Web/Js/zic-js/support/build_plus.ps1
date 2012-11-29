Param($Path)
Get-ChildItem -Path $Path -Include *.js -Recurse | % { 
	.\compiler\compiler.exe --js $_.FullName --js_output_file ($_.FullName -replace "\\plus-jq\\", "\\__build\\plus-jq\\") --charset=UTF-8
}