seajs.use [glo_path+"init", "plus-jq/jq_ztree", glo_path+"app/seat"], (init, ztree, seat) ->
	$ = init.jq
	fix = (box) ->
		init.fix_submit(box)
	seat.Init(init)
	ztree($)

	$ ->
		fix $('body')
		seat.Loader {
			el: $("#seatbox")
			sub: $("#submit")
			el_classic: $("#seatbox_c")
			sub_classic: $("#submit_c")
			fluent: $("#fluent")
			classic: $("#classic")
			turnbtn: $("#turnbtn")
			exchange: $("#exchange")
			userst_json: glo_userstore
			userst_dom: $("#userprivbox")
		}

		treeindex = $('#treeindex')
		
		znodes = if glo_nodes == "" then [] else init.JSON.parse(glo_nodes)
		cusfolder = if glo_cusfolder == "" then [] else init.JSON.parse(glo_cusfolder)
		znodes.push item for item in cusfolder

		$.fn.zTree.init treeindex, {
			data: {
				key: 
					title: "Description"
					name: 'Name'
				simpleData: 
					enable: true
					idKey: 'Id'
					pIdKey: 'ParentFolderId'
			}
			edit: {
				enable: true
				showRenameBtn: false
				showRemoveBtn: false
				drag: {
					isCopy: false
					isMove: true
					prev: true
					next: true
					inner: true
				}
			}
			view: {
				dblClickExpand: false
			}
			callback: {
				onClick: (e, treeId, treeNode, clickFlag) ->
					$.ajax {
						url: "/Seat/UseInject"
						data: { seatid: treeNode.Id }
						success: (m) ->
							if not init.checkreturn(m) then return
							seat.InitApp {
								mod: m.seat
								propauth: m.propauth
							}
					}
				onDrop: (e, treeId, treeNodes) ->
					treeObj = $.fn.zTree.getZTreeObj(treeId)
					cusnodes = treeObj.getNodesByParam('ParentFolderId', 1000)
					$.ajax {
						url: "/Seat/UseUpdateCusNodes"
						data: { cus_nodes: init.JSON.stringify(cusnodes) }
						success: (m) ->
							if not init.checkreturn(m)
								init.shownotifi '更新自定义文件夹出错，请联系管理员。'
					}
			}
		}, znodes

		$('[treenode_a]', treeindex).click ->
			button = $(this).prev('button.center_close, button.center_open, button.roots_open, button.roots_close')
			if not button.length then return
			$('button.center_open, button.roots_open', treeindex).not(button).click()
			button.click()

		$('button.ico_docu', treeindex).first().click();