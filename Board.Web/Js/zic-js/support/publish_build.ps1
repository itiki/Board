Get-ChildItem -Path ..\..\page -Include *.js -Recurse | % { 
	uglifyjs $_.FullName > ($_.FullName -replace "\\page\\", "\\__build\\page\\")
}
spm build ..\..\init.js --combine --app_url /Scripts --loader_config ./seajs-config.js