seajs.use [glo_path+'init', glo_path+"app/temp"], (init, temp) ->
	$ = init.jq
	fix = (box) ->
		# init.fix_submit(box)
	temp.Init(init)

	$ ->
		fix $('body')

		window.App = new temp.TempAppView {
			el: $("#tempbox")
			editJson: glo_tempjson
			seatid: glo_seastid
			btnAddT: $('#btnAddT')
			btnAddH: $('#btnAddH')
			formSubmit: $("#vali_form")
			txtName: $("#seatName")
			folderSel: $("#Folders")
		}