seajs.use glo_path+'init', (init) ->
	$ = init.jq
	fix = (box) ->
		init.fix_submit(box)

	$ ->
		fix $('body')