$newLine = [System.Environment]::NewLine
Get-ChildItem -Path .\await -Include *.js -Recurse | % { 
	$lines = Get-Content -Path $_.FullName -Encoding UTF8
	$content = "define(function (require, exports, module) { return function (jQuery) {"
	$content += $newLine
	$content += [String]::Join($newLine,$lines)
	$content += $newLine	
	$content += "}});"
	Set-Content -Value $content -Path $_.FullName -Encoding UTF8
}