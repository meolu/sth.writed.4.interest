(function($){
	$(document).ready(function(){

		// 批量拒登 - 理由文案 
		var feedbackContent = {
			map : { banner : '素材', letter : '文案', violation : '违规', illegal : '违法', others : '其它' },
			content : {
				banner : [
					{ id:11, text:'素材为纯白或者浅色，需加深色边框；', detail:'素材为纯白或者浅色的底色时，需要为素材添加1像素深色边框'},
					{ id:12, text:'素材边框缺失；', detail:'素材边框缺失，请补全完整后重新提交'},
					{ id:13, text:'素材无法正常展现/空白/不完整 ；', detail:'素材无法正常展现/或显示空白/或展现不完整，请检查后重新提交'},
					{ id:14, text:'素材透底添加深色底层；', detail:'素材透底添加深色底层，请添加底层后提交'},
					{ id:15, text:'素请保持素材美观、清晰；', detail:'请保持素材美观、清晰、明确商品和文案内容'},
					{ id:16, text:'模板使用不正确；', detail:'模板使用不正确，请添加完整模板中LOGO元素，或者删除模块中LOGO字样'}
				],
				letter : [
					{ id:21, text:'不能使用最高级和绝对性用语；', detail:'素材中不能使用最高级用语和绝对性用语'},
					{ id:22, text:'文案禁止使用低俗用语、色情；', detail:'素材文案禁止使用低俗用语、不得含有暴露或者色情内容'},
					{ id:23, text:'素材文案不得使用虚假宣传；', detail:'素材文案不得使用虚假宣传，请修改文案'},
					{ id:24, text:'素材和落地页中禁止出现管制刀具；', detail:'素材和落地页中禁止出现管制刀具'}
				],
				violation : [
					{ id:31, text:'落地页无法打开/落地页显示异常；', detail:'落地页无法打开/落地页显示异常/落地页与注册页信息不符/创意内容与落地页商品不符'},
					{ id:32, text:'创意中不得含有诱导点击的行为；', detail:'创意中不得含有诱导点击的行为'},
					{ id:33, text:'动画文件请在30秒内停止；', detail:'动画文件请在30秒内停止'},
					{ id:34, text:'不得投放嵌入视频的广告内容；', detail:'不得投放嵌入视频的广告内容'},
					{ id:35, text:'素材点击不得含有下载内容；', detail:'素材点击不得含有下载内容'},
					{ id:36, text:'素材中禁止添加音频文件；', detail:'素材中禁止添加音频文件'}
				],
				illegal : [
					{ id:41, text:'请提供商品资质或明星授权等；', detail:'请提供商品资质或明星授权等'},
					{ id:42, text:'有奖销售奖品价值不得超过5000元；', detail:'有奖销售奖品价值不得超过5000元'},
					{ id:43, text:'素材和落地页中禁止出现人民币等；', detail:'素材和落地页中禁止出现人民币、国旗国徽或国家领导人等形象'},
					{ id:44, text:'落地页中禁止出现成人用品；', detail:'落地页中禁止出现成人用品'},
					{ id:45, text:'不能提及其他竞品商品；', detail:'不能提及其他竞品商品'}
				],
				others : []
			}
		},
		feedbackModel = {};

	  	//实例化一个  mediav.Grid 类
	  	//参数1：表格渲染的目标容器ID
	  	//参数2：一些控制参数。
	  	//cm表格列模型。
	  	//handlePage分页处理函数，传出参数页码。
		var cm = tableHead;
	  	var mvgrid = new mediav.Grid("bannerList", {
	  		"cm": cm,
	  		"handlePage": function(page,size){retrieveAdver(page,size);},
	  		"handleSize": function(size){sizeChange(size);},
	  		//"handleStar": function(id, checked){markStar(id, checked);},
			"showCheckbox": true,
			"showStar": false,
			"fixedTitle": false
	  	});
	  	Boxy.DEFAULTS.title = oLang.errortitle;
		function sizeChange(size){
			var page = 1;
			retrieveAdver(page, size);
		}

		// 实例化日期组件
		var aDate = $('#frm_customDate').val().split(' ~ ');
    	dateActive($("#frm_customDate").val());
    	$('#calendar').DatePicker({
	        flat: true,
	        format: 'Y-m-d',
	        date: aDate,
	        current:aDate[1],
	        calendars: 2,
	        mode: 'range',
	        starts: 1,
	        showButton:false,
	        allowRange: 0,
	        onChange: function(formated) {
	            $('#frm_customDate').attr('value',formated.join(' ~ '));
	        }
	    });
	    var state = false;
	    $('.dateSelect').bind('click', function(e){
	        $('#calendar').stop().animate({height: state ? 0 : $('#calendar div.datepicker').get(0).offsetHeight}, 500);
	        state = !state;
	        return false;
	    });
	    $('.datepickerSubmit').bind('click',function(e){
	        $('#calendar').stop().css({height:0});
	        state = !state;

	        retrieveAdver(1, mvgrid.getSize());
	        dateActive($("#frm_customDate").val());
	        return false;
	    });
        function setActiveDateClass() {
            var selectedDate = $(".dateSelectArea > .dateSelectRange > li > a.active");
            var selectedRel = selectedDate.attr('rel') ? selectedDate.attr('rel') : 'all_days';
            $(".dateSelectArea > .dateSelectRange > li > a[rel=" + selectedRel + "]").addClass("active");
            selectedDate.parent().siblings().find("a").removeClass("active");
        }
        setActiveDateClass();
	    $(".dateSelectArea > .dateSelectRange > li > a").click(function(ajax){
            ajax = ajax || 1;
	        var range = ($(this).attr("rel") == 'all_days') ? '全部' : getDateRange($(this).attr("rel"));
	        var aDate = range.split(' ~ ');
            if(range !== '全部') {
                $('#calendar').DatePickerSetDate(aDate, true);
            }
	        $('#frm_customDate').attr('value',range);
            if(ajax){
                $('.datepickerSubmit').click();
            }
            setActiveDateClass();
	    });
	    $('#calendar div.datepicker').css('position', 'absolute');

		//处理分页逻辑
		var oBannerId2Info = {};
		var oBannerPubAudit = {};
		function retrieveAdver(page, size){
			var page = page || 1;
			var size = size || globalPageSize;
			var sortOrder = $('.mvgrid .grid th').filter(".desc,.asc").attr('class');
			sortOrder = (sortOrder=="sort asc") ? "asc" : "desc";
			var index = $('.mvgrid .grid th').filter(".desc,.asc").attr('title');
			var sortName = index ? cm[index].name : "";
			var sortType = index ? cm[index].sorttype : "";

			var url = ajaxUrl + '&page=' + page + '&pageSize=' + size;

            var searchField = $('#searchField').val();
	  		var searchword = $('#searchword').val();
	  		if(searchword != '' && searchword != oLang.banner_search_tips)
	  			url += '&searchword=' + encodeURIComponent(searchword) + '&searchField=' + searchField;

			(sortOrder) ? url += '&sortOrder='+sortOrder+'&sortName='+sortName+'&sortType='+sortType : '';

			var subQuery = getFilterQuery();
			url += '&' + subQuery;
			$("#bannerList").block();

			$.getJSON(url, function(data){
				mvgrid.setData(data); //参考交换用的JSON数据格式
				if(typeof(data) != 'undefined' && data != null && data != '') {
					oBannerId2Info = data.bannerid2Info;
					oBannerPubAudit = data.bannerPubAudit;
				}
				$("#bannerList").unblock();
				$(".warningTitlePicTip").tooltip({tipWidth:260,delayShow:true});
                $(".memoWarning").tooltip({tipWidth:260,delayShow:true});
				bindAddOpt();
			});
			window.scroll(0, 0);
		}
		retrieveAdver();

		function bindAddOpt() {
			$('.creativedownload').click(function() {
				$('[name=downloadbannerid]').val($(this).attr('_id'));
				$('form#auditing-download-form').submit();
			});
		}
        function changeUniqEnable(){
            if(($('#dealFlag').val()==='0')) {
                $('#banner_uniq_span').show();
            } else {
                $('#banner_uniq_span').hide();
            }
        }
        function changeDefaultDate() {
            if(($('#dealFlag').val()==='0')) {
                $(".dateSelectArea > .dateSelectRange > li > a[rel=all_days]").click();
            } else {
                $(".dateSelectArea > .dateSelectRange > li > a[rel=today]").click();
            }
        }
        changeUniqEnable();
		$('[name=dealFlag]').change(function() {
            changeUniqEnable();
            changeDefaultDate();
		});
		$('[name=status]').change(function() {
            retrieveAdver(1, mvgrid.getSize());
		});
		$('[name=creativetype]').change(function() {
			retrieveAdver(1, mvgrid.getSize());
		});

        $('[name=displayType]').change(function() {
            retrieveAdver(1, mvgrid.getSize());
        });
        $('[name=creativeSource]').change(function() {
            retrieveAdver(1, mvgrid.getSize());
        });
		$('[name=sizeid]').change(function() {
			retrieveAdver(1, mvgrid.getSize());
		});
		$('[name=pubAuditStatus]').change(function() {
			retrieveAdver(1, mvgrid.getSize());
		});
		$('[name=countryid]').change(function() {
			retrieveAdver(1, mvgrid.getSize());
		});
		$('[name=bannerUniq]').click(function() {
			retrieveAdver(1, mvgrid.getSize());
		});
		function getFilterQuery() {
            var displayType = $('[name=displayType]').val();        // 投放分类
            var source = $('[name=creativeSource]').val();          // 来源
            var status = $('[name=status]').val();                  // 审核状态
            var dealFlag = $('[name=dealFlag]').val();              // 处理状态
			var creativeType = $('[name=creativetype]').val();      // 创意类型
			var sizeId = $('[name=sizeid]').val();                  // 尺寸
            var pubAuditStatus = $('[name=pubAuditStatus]').val();  // 第三方审核状态
			var countryid = $('[name=countryid]').val();            // 国家地区
            var bannerUnique = $('#bannerUniq').attr('checked') ? 1 : 0;  // 去重
            var startDate = ($('#frm_customDate').val() == '全部') ? '' : $('#frm_customDate').val().split(' ~ ')[0];
            var endDate = ($('#frm_customDate').val() == '全部') ? '' : $('#frm_customDate').val().split(' ~ ')[1];
			var subUrl = '';

            if(endDate !== '') {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate() + 1);
                endDate = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()].join('-');
            }

            subUrl += 'startDate=' + startDate + '&endDate=' + endDate;
            subUrl += '&plat=' + displayType + '&source=' + source + '&status=' + status + '&dealFlag=' + dealFlag + '&creativetype=' + creativeType + '&countryid=' + countryid;
            if(sizeId !== '') {
                subUrl += '&sizeid=' + sizeId;
            }
            if(pubAuditStatus != '') {
                subUrl += '&pubAuditStatus=' + pubAuditStatus;
            }
			subUrl += '&bannerUniq=' + bannerUnique;
			return subUrl;
		}

		$('[name=batch_download]').click(function() {
			var ids = mvgrid.getSelected();
			if ("" == ids) {
				//Boxy.alert();
				return false;
			} else {
				$('[name=downloadbannerid]').val(ids);
				$('form#auditing-download-form').submit();
			}

		});

		var oBoxy = {};
		//$('a.creativeauditing').live('click',function(e){
		    //var id = $(e.target).attr('_id');
		    //auditingBoxy(id);
		//});

		$('[name=batch_auditing_ok]').click(function() {
			var ids = mvgrid.getSelected();
			if ("" == ids) {
				//Boxy.alert();
				return false;
			} else {
				auditingBoxy(ids);
			}
		});

		// 批量拒登 - 拒登理由渲染 
		var feedbackStr = function () {
			var tStr = [], cStr =[], count = 0;
			tStr.push('<ul class="feedbackNav">');
			cStr.push('<div class="feedbackTab">');
			for (var i in feedbackContent.content) {
				if (count == 0) {
					tStr.push('<li class="active" data-num="' + count + '">' + feedbackContent.map[i] + '</li>');
					cStr.push('<div class="tabPane active" data-num="' + count + '">');
				} else {
					tStr.push('<li data-num="' + count + '">' + feedbackContent.map[i] + '</li>');
					cStr.push('<div class="tabPane" data-num="' + count + '">');
				}

				var lStr = [], cont = feedbackContent.content[i];
				if ( i != 'others' ) {
					for (var j in cont) {
						lStr.push('<div class="addText">' + '<span class="addBtn" data-id="' + cont[j].id + '" data-text="' + cont[j].text + '" data-detail="' + cont[j].detail + '"></span>'
							+ '<label title="' + cont[j].detail + '">' + cont[j].text + '</label></div>');
					}
				} else {
					lStr.push('<div style="padding:10px">' + '<textarea type="text" class="othersText"></textarea>'
						+ '<div class="othersBtn btnStyle"><span class="btnInsideStyle">'
						+ '确定' + '</span></div>' + '</div>');
				}
				cStr.push(lStr.join(''));
				cStr.push('</div>');
				count++;
			}
			tStr.push('</ul>');
			cStr.push('</div>');
			return tStr.join('') + cStr.join('');
		}

		// 批量拒登 - 渲染选择池 
		var feedbackBoxRender = function ( el,models,num ) {
			var rStr = [];
			for (var i = 0, l = models.length; i<l; i++) {
				rStr.push('<div class="selectTr">' + models[i].text
					+ '<span class="del" data-id="' + models[i].id + '"></span>' + '</div>');
			}
			$(el).html(rStr.join(''));
			$(el).find('.del').click(function(){
				var my_data = feedbackModel['model_'+num],
					my_id = $(this).attr('data-id'),
					my_item = $.map(my_data, function(obj, sit) {
						if ( obj.id == my_id ) { return sit; }
					});
				if ( my_item.length > 0){
					my_data.splice(my_item[0],1);
					feedbackBoxRender( el,models,num );
				}
			})
		}
		var returnFeedbackModel = function (num) {
			var newModel = $.map(feedbackModel['model_'+num], function(obj) { return obj; });
			return newModel;
		}


		function auditingBoxy(ids) {
			Boxy.confirm(oLang.batch_auditing_confirm, function(){
				$.ajax({
					type: "POST",
					//url: "do.php?method=del_camp",
					url: "/auditing/banner/edit?type=save" ,
					data: 'bannerid=' + ids + '&status=1',
					dataType: "json",
					success: function(data, status) {
						if(data.result == 1) {
							var page = mvgrid.getPage();
							if(page <= 0)
								page = 1;
							retrieveAdver(page);
						} else {
							Boxy.alert(data.msg);
						}
					}
				});
			}, {title:oLang.batch_auditing_ok});

		}
		var oBatchRefuseBoxy = {};
		$('[name=batch_auditing_refuse]').click(function() {
			var ids = mvgrid.getSelected();
			feedbackModel = {};
			if ("" == ids) {
				//Boxy.alert();
				return false;
			} else {
				var aIds = ids.toString().split(',');
				var aHtml = new Array();
				aHtml[aHtml.length] = '<form ID="auditRefuse">';
				aHtml[aHtml.length] = '<div class="mvgrid" style="width:1200px;height:450px;overflow:auto">';
				aHtml[aHtml.length] = '<table class="grid" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">';
				aHtml[aHtml.length] = '<col width="2%"/>';
				aHtml[aHtml.length] = '<col width="27%"/>';
				aHtml[aHtml.length] = '<col width="16%"/>';
				aHtml[aHtml.length] = '<col width="55%"/>';
				aHtml[aHtml.length] = '<thead>';
				aHtml[aHtml.length] = '<tr class="mvgridth">';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="checkbox"><input type="checkbox" checked="checked" name="chkAll"></th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="name">创意名称</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="advertisername">点击地址</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="createtime" >拒登理由</th>';
				aHtml[aHtml.length] = '</tr>';
				aHtml[aHtml.length] = '</thead>';
				aHtml[aHtml.length] = '<tbody>';

				for(var i = 0; i < aIds.length; i++) {
					if(typeof oBannerId2Info[aIds[i]] != undefined) {
						aHtml[aHtml.length] = '<tr class="">';
						aHtml[aHtml.length] = '<td align="left">'+ '<input type="checkbox" checked="checked" name="refuseChkItem" value="' + aIds[i] + '" />' +'</td>';
						aHtml[aHtml.length] = '<td align="left">'+ oBannerId2Info[aIds[i]].preview +'</td>';
						aHtml[aHtml.length] = '<td align="left">'+ oBannerId2Info[aIds[i]].link +'</td>';
						aHtml[aHtml.length] = '<td align="left">'
							+ '<div id="feedback_list_' + aIds[i] + '" class="feedback_list" style="float:left">' + feedbackStr() + '</div>'
							+ '<div class="feedback_arrow"></div>'
							+ '<div class="feedback_select">'
							+ '<div class="feedback_select_action"><input type="hidden" name="bannerid[]" data-id="' + aIds[i] + '" />'
							+ '<textarea style="display:none" name="auditinginfo[]" data-id="' + aIds[i] + '"></textarea>'
							+ '<span style="padding-left:5px;cursor: pointer;" class="copyAuditinginfo" data-num="' + aIds[i] + '"><image src="'+ staticPages +'/images/icon_copy.png" title="复制" /><span>复制全部</span></span>'
							+ '</div>'
							+ '<div id="feedback_box_' + aIds[i] + '" class="feedback_select_box" style="float:left">' + '</div>'
							+ '</div>' + '</td>';
						aHtml[aHtml.length] = '</tr>';
					}
				}
				aHtml[aHtml.length] = '</tbody>';
				aHtml[aHtml.length] = '</table></div>';
				aHtml[aHtml.length] = '<div class="answers"><input type="button" ID="batchRefuseConfirm" value="'+ oLang.confirmCBtn +'"><span style="padding-left:20px"></span><input ID="batchRefuseCancel" type="button" value="'+ oLang.cancelCBtn +'"></div>';
				aHtml[aHtml.length] = '</form>';
				oBatchRefuseBoxy =  new Boxy('<div class="boxy" style="width:1200px;height:500px">' + aHtml.join("") + '</div>',
				        {
				        title:oLang.creative_auditing,        //标题
				        autoWidth:true,
				        closeText:"X",            //关闭文字
				        modal:true        //背景是否变暗
				});

				// 批量拒登 - 拒登理由事件绑定 
				$('.feedback_list').each(function( num ){
					feedbackModel['model_' + ids[num]] = [];
					var $this = $(this);
					$this.find('.feedbackNav li').mouseover(function(){
						$this.find('.feedbackNav li').removeClass('active');
						$(this).addClass('active');
						$this.find('.feedbackTab .tabPane').removeClass('active');
						$this.find('.feedbackTab .tabPane[data-num="' + $(this).attr('data-num') + '"]').addClass('active');
					})
					$this.find('.feedbackTab .tabPane .addBtn').click(function(){
						var my_id = $(this).attr('data-id'),
							my_text = $(this).attr('data-text'),
							my_detail = $(this).attr('data-detail');
						var my_model = feedbackModel['model_' + ids[num]],
							my_item = $.map(my_model, function(obj) {
								if ( obj.id == my_id ) { return obj; }
							});
						if ( my_item.length == 0 ) {
							my_model.push({ id : my_id, text : my_text, detail : my_detail });
							feedbackBoxRender('#feedback_box_'+ids[num], my_model, ids[num]);
						}
					})
					$this.find('.feedbackTab .tabPane .othersBtn').click(function(){
						var my_model = feedbackModel['model_' + ids[num]],
							my_item = $.map(my_model, function(o, n) {
								if ( o.id == '5' ) { return n; }
							}),
							my_text = $this.find('.feedbackTab .tabPane .othersText').val();
						if ( my_item.length == 0 ) {
							my_model.push({ id: '5' , text: my_text, detail: my_text});
						} else {
							my_model[my_item[0]] = { id: '5' , text: my_text, detail: my_text};
						}
						feedbackBoxRender('#feedback_box_' + ids[num], my_model, ids[num]);
					})
				})
				$('#auditRefuse :checkbox[name=chkAll]').click(function(evt){
					$('#auditRefuse :checkbox[name="refuseChkItem"]').attr('checked',$(this).attr('checked'));
				})
			}
		});

		// 批量拒登 - 复制拒登理由 
		$('form#auditRefuse span.copyAuditinginfo').live('click',function(e){
			var my_num = $(this).attr('data-num'),
				ids = mvgrid.getSelected();
			//if(feedbackModel['model_' + my_num].length)
			$('.feedback_list').each(function( num ){
				feedbackModel['model_' + ids[num]] = returnFeedbackModel(my_num);
				feedbackBoxRender('#feedback_box_'+ids[num], feedbackModel['model_' + ids[num]], ids[num]);
			})
		});

		var oPubAuditBoxy = {};
		$('a.showPubAuditDetail').live('click', function() {
			var id = $(this).attr('_id');
			if ("" == id || typeof(oBannerPubAudit[id]) == undefined) {
				return false;
			} else {
				var aHtml = new Array();
				aHtml[aHtml.length] = '<div class="mvgrid" style="width:550px;height:300px;overflow:auto">';
				aHtml[aHtml.length] = '<table class="grid" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">';
				aHtml[aHtml.length] = '<col width="33%"/>';
				aHtml[aHtml.length] = '<col width="33%"/>';
				aHtml[aHtml.length] = '<col width="33%"/>';
				aHtml[aHtml.length] = '<thead>';
				aHtml[aHtml.length] = '<tr class="mvgridth">';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="name">媒体名称</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="advertisername">审核结果</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="createtime" >审核信息</th>';
				aHtml[aHtml.length] = '</tr>';
				aHtml[aHtml.length] = '</thead>';
				aHtml[aHtml.length] = '<tbody>';
				for(var i = 0; i < oBannerPubAudit[id].length; i++) {
					aHtml[aHtml.length] = '<tr class="">';
					aHtml[aHtml.length] = '<td align="left">'+ oBannerPubAudit[id][i].name_cn +'</td>';
					aHtml[aHtml.length] = '<td align="left">'+ oBannerPubAudit[id][i].pubAuditStatus +'</td>';
					aHtml[aHtml.length] = '<td align="left">'+ oBannerPubAudit[id][i].mediamemo +'</td>';
					aHtml[aHtml.length] = '</tr>';
				}
				aHtml[aHtml.length] = '</tbody>';
				aHtml[aHtml.length] = '</table></div>';
				oBatchRefuseBoxy =  new Boxy('<div class="boxy" style="width:570px;height:320px">' + aHtml.join("") + '</div>',
				        {
				        title:oLang.creative_auditing,        //标题
				        autoWidth:true,
				        closeText:"X",            //关闭文字
				        modal:true        //背景是否变暗
				});
			}
		});

		// 批量拒登 - 提交表单 
		$('input#batchRefuseConfirm').live('click',function(e){
			var auditFlag = true;
			// $('[name=auditinginfo\[\]]').each(function(){
			// 	if($(this).val() == '') {
			// 		Boxy.alert(oLang.auditing_refuse_reason_cannotnull);
			// 		auditFlag = false;
			// 		return false;
			// 	}
			// });

			var ids = mvgrid.getSelected(), postStr = { bannerid:[], auditinginfo:[] }, count = 0;
			$.each(feedbackModel,function(n,o){
				var tStr = [], my_model = o, my_check = $('#auditRefuse :checkbox[name="refuseChkItem"][value="'+ids[count]+'"]').attr('checked');
				if( o.length == 0 && my_check){
					Boxy.alert(oLang.auditing_refuse_reason_cannotnull);
					auditFlag = false;
					return false;
				}
				$.each(my_model, function(num,obj){
					tStr.push(obj.detail);
				})
				if ( my_check ) {
					postStr.bannerid.push(ids[count]);
					postStr.auditinginfo.push(tStr.join('; '));
				}
				count++;
			})

			if(auditFlag == false) {
				return false;
			}
			$(this).attr('disabled', true);
			//var postData = $("form#auditRefuse").serialize();
			if ( $.param(postStr) == '' ) {
				oBatchRefuseBoxy.hide();
			} else {
				var postData =  $.param(postStr) + '&status=2';
				$.ajax({
					type: "POST",
					url: "/auditing/banner/edit?type=save" ,
					data:  postData,
					dataType: "json",
					success: function(data, status) {
						if(data.result == 1) {
							var page = mvgrid.getPage();
							if(page <= 0)
								page = 1;
							retrieveAdver(page);
							oBatchRefuseBoxy.hide();
						} else {
							Boxy.alert(data.msg);
							$(this).attr('disabled', false);
						}
					}
				});
			}
		});

		$('input#batchRefuseCancel').live('click',function(e){
			oBatchRefuseBoxy.hide();
		});

		/* 批量处理 */
		var oBatchDealBoxy = {};
		$('[name=batch_auditing_deal]').click(function() {
			var ids = mvgrid.getSelected();
			feedbackModel = {};
			if ("" == ids) {
				//Boxy.alert();
				return false;
			} else {
				var aIds = ids.toString().split(',');
				var levelMap = {
					1 : 'A级',
					2 : 'B级',
					3 : 'C级',
					4 : 'A级（极佳）',
					5 : 'B级（良好）',
					6 : 'C级（普通）'
				}
				var aHtml = new Array();
				aHtml[aHtml.length] = '<form ID="auditDeal">';
				aHtml[aHtml.length] = '<div class="mvgrid" style="width:1200px;height:450px;overflow:auto">';
				aHtml[aHtml.length] = '<table class="grid" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">';
				aHtml[aHtml.length] = '<col width="3%"/>';
				aHtml[aHtml.length] = '<col width="27%"/>';
				aHtml[aHtml.length] = '<col width="20%"/>';
				aHtml[aHtml.length] = '<col width="20%"/>';
				aHtml[aHtml.length] = '<col width="30%"/>';
				aHtml[aHtml.length] = '<thead>';
				aHtml[aHtml.length] = '<tr class="mvgridth">';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="checkbox"><input type="checkbox" checked="checked" name="chkAll"></th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="banner">创意</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="name">广告主</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="level">广告主等级</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="action" >通过操作</th>';
				aHtml[aHtml.length] = '</tr>';
				aHtml[aHtml.length] = '</thead>';
				aHtml[aHtml.length] = '<tbody>';
				
				for(var i = 0; i < aIds.length; i++) {
					if(typeof oBannerId2Info[aIds[i]] != undefined) {
						if ( oBannerId2Info[aIds[i]].level != null ) {
							var checkLevel = oBannerId2Info[aIds[i]].level;
						} else {
							var checkLevel = oBannerId2Info[aIds[i]].adLevel == '6' ? oBannerId2Info[aIds[i]].adLevel : oBannerId2Info[aIds[i]].adLevel + 1;	
						}
						
						aHtml[aHtml.length] = '<tr class="">';
						aHtml[aHtml.length] = '<td align="left">'+ '<input type="checkbox" checked="checked" name="dealChkItem" value="' + aIds[i] + '" />' +'</td>';
						aHtml[aHtml.length] = '<td align="left">'+ oBannerId2Info[aIds[i]].preview +'</td>';
						aHtml[aHtml.length] = '<td align="left">'+ oBannerId2Info[aIds[i]].advertisername +'</td>';
						aHtml[aHtml.length] = '<td align="left">'+ levelMap[oBannerId2Info[aIds[i]].adLevel] +'</td>';
						aHtml[aHtml.length] = '<td align="left">' 
											+ '<div><label><input type="radio" name="advLevel'+aIds[i]+'" value="4" ';
						aHtml[aHtml.length] = (checkLevel == 4) ? 'checked="checked"' : ''; 
						aHtml[aHtml.length] = ' />A级（极佳）</label></div>' 
											+ '<div><label><input type="radio" name="advLevel'+aIds[i]+'" value="5" ';
						aHtml[aHtml.length] = (checkLevel == 5) ? 'checked="checked"' : ''; 
						aHtml[aHtml.length] = '/>B级（良好）</label></div>'
											+ '<div><label><input type="radio" name="advLevel'+aIds[i]+'" value="6" ';
						aHtml[aHtml.length] = (checkLevel == 6) ? 'checked="checked"' : ''; 
						aHtml[aHtml.length] = '/>C级（普通）</label></div>'
						aHtml[aHtml.length] = '<div><span style="padding-left:5px;cursor: pointer;" class="copyAuditinginfo" data-num="' + aIds[i] + '"><image src="'+ staticPages +'/images/icon_copy.png" title="复制" /><span>复制全部</span></span></div>'
											+ '</td>';
						aHtml[aHtml.length] = '</tr>';
					}
				}
				aHtml[aHtml.length] = '</tbody>';
				aHtml[aHtml.length] = '</table></div>';
				aHtml[aHtml.length] = '<div class="answers"><input type="button" ID="batchDealConfirm" value="'+ oLang.confirmCBtn +'"><span style="padding-left:20px"></span><input ID="batchDealCancel" type="button" value="'+ oLang.cancelCBtn +'"></div>';
				aHtml[aHtml.length] = '</form>';
				oBatchDealBoxy =  new Boxy('<div class="boxy" style="width:1200px;height:500px">' + aHtml.join("") + '</div>',
				        {
				        title:oLang.creative_auditing,        //标题
				        autoWidth:true,
				        closeText:"X",            //关闭文字
				        modal:true        //背景是否变暗
				});

				$('#auditDeal :checkbox[name="chkAll"]').click(function(evt){
					$('#auditDeal :checkbox[name="dealChkItem"]').attr('checked',$(this).attr('checked'));
				})
			}
		});

		// 批量处理 - 复制 
		$('form#auditDeal span.copyAuditinginfo').live('click',function(e){
			var my_num = $(this).attr('data-num'),
				ids = mvgrid.getSelected();
			var this_val = $('input[name="advLevel' + my_num + '"]:checked').val();
			for (var i = 0, l = ids.length; i<l ; i++) {
				$('input[name="advLevel' + ids[i] + '"][value="' + this_val + '"]').attr('checked',true)
			}
		});		

		// 批量处理 - 提交表单 
		$('input#batchDealConfirm').live('click',function(e){
			var auditFlag = true;

			var ids = mvgrid.getSelected(), postStr = {};
			
			for (var i = 0, l = ids.length; i<l ; i++) {
				var my_check = $('#auditDeal :checkbox[name="dealChkItem"][value="'+ids[i]+'"]').attr('checked');
				if (my_check) {
					postStr[ids[i]] = $('input[name="advLevel' + ids[i] + '"]:checked').val();
				}
			}

			if(auditFlag == false) {
				return false;
			}
			$(this).attr('disabled', true);
			if ( $.param(postStr) == '' ) {
				oBatchDealBoxy.hide();
			} else {
				var postData =  $.param({bannerid : postStr}) + '&status=1';
				$.ajax({
					type: "POST",
					url: "/auditing/banner/edit?type=save" ,
					data:  postData,
					dataType: "json",
					success: function(data, status) {
						if(data.result == 1) {
							var page = mvgrid.getPage();
							if(page <= 0)
								page = 1;
							retrieveAdver(page);
							oBatchDealBoxy.hide();
						} else {
							Boxy.alert(data.msg);
							$(this).attr('disabled', false);
						}
					}
				});
			}
		});

		$('input#batchDealCancel').live('click',function(e){
			oBatchDealBoxy.hide();
		});



		$('input.auditingbutton').live('click',function(e){
		    var bannerid = $(e.target).attr('_id');
		    var status = $(e.target).attr('_value');
			$.ajax({
				type: "POST",
				//url: "do.php?method=del_camp",
				url: "/auditing/banner/edit?type=save" ,
				data: 'bannerid=' + bannerid + '&status=' + status,
				dataType: "json",
				success: function(data, status) {
					if(data.result == 1) {
						var page = mvgrid.getPage();
						if(page <= 0)
							page = 1;
						retrieveAdver(page);
						oBoxy.hide();
					} else {
						Boxy.alert(data.msg);
					}
				}
			});
		});

		$("body").live('click',function(){
			$("p.floatSmall").unwrap().remove();
		});
		//阻止冒泡
		$("p.floatSmall").live('click',function(){
			return false;
		});

		$("a.creativeauditing").live("click",function(){
			var _id = $(this).attr('_id');
			$("p.floatSmall").unwrap().remove();
			$(this).wrap('<div class="floatDiv" style="display:inline-block"></div>').parent().append(
					'<p class="floatSmall" style="padding-top:25px;width:200px;margin-left:-150px"><input type="button" class="btnPic btnBlueSmall"  _id="'+ _id +'" _value=1 value="'+ oLang.auditing_input_ok +'"/> ' +
					'<span style="padding-left:25px"/><input type="button" class="btnPic btnBlueSmall"  _id="'+ _id +'" _value=2 value="'+ oLang.auditing_input_refuse +'"/></p>').find(".floatSmall").show();
			return false;
		})
		var oRefuseBoxy = {};
		$(".floatSmall > .btnBlueSmall").live("click",function(){
		    var bannerid = $(this).attr('_id');
		    var status = $(this).attr('_value');
		    if(status == 2) {
			    var htmlSrc = '<div name="refusediv" style="width:260px;height:150px;padding-top:10px;padding-left:10px;text-align:left">'
			    	+ '<span>'+ oLang.auditing_check_refuse_reason +'</span> <br>'
			    	+ '<textarea cols="20" rows="3" name="auditinginfo"></textarea> <br>'
			    	+ '<div style="padding-top: 10px;"><input type="button" value="'+ oLang.confirmCBtn +'"  _id="'+ bannerid +'" class="btnPic btnBlueSmall formBtnRefuseOk"> </div>'
			    	+ '</div>';
				oRefuseBoxy =  new Boxy('<div class="boxy">' + htmlSrc + '</div>',
				        {
				        title:oLang.creative_auditing,        //标题
				        autoWidth:true,
				        closeText:"X",            //关闭文字
				        modal:true,        //背景是否变暗
				        fixed:true,        //窗口是否固定
				        cache:true,        //是否被遮挡
				        draggable:true,      //这个设定窗口是否可以拖动，要定义title才有效，设定了modal就无效
				        center:true,        //弹出对话框是否居中
				        afterDrop:function(){},    //关闭对话框后执行的｛IE下面关闭不了,原因不明｝
				        afterShow:function(){},    //打开对话框后执行的
				        afterHide:function(){}    //隐藏对话框后执行的

				});

		    } else {
				$.ajax({
					url:"/auditing/banner/edit?type=save",
				  	type:"post",
				  	dataType:"json",
				    context:$(this),
				    data:'bannerid=' + bannerid + '&status=' + status,
				    success:function(data){
						if(data.result == 1) {
							var page = mvgrid.getPage();
							if(page <= 0)
								page = 1;
							var size = mvgrid.getSize();
							retrieveAdver(page, size);
						} else {
							Boxy.alert(data.msg);
						}
			  		},
			  		error:function(msg){
				  		alert("Ajax error status: "+msg.status);
				    }
				});
		    }

		});

		$("input.formBtnRefuseOk").live("click",function(){
		    var bannerid = $(this).attr('_id');
		    var auditinginfo = $("div[name=refusediv] [name=auditinginfo]").val();
		    if(auditinginfo == '') {
		    	Boxy.alert(oLang.auditing_refuse_reason_cannotnull);
		    	return;
		    }
			$.ajax({
				url:"/auditing/banner/edit?type=save",
			  	type:"post",
			  	dataType:"json",
			    context:$(this),
			    data:'bannerid=' + bannerid + '&status=2'+ '&auditinginfo=' + auditinginfo,
			    success:function(data){
					if(data.result == 1) {
						oRefuseBoxy.hide();
						var page = mvgrid.getPage();
						if(page <= 0)
							page = 1;
						var size = mvgrid.getSize();
						retrieveAdver(page, size);
					} else {
						Boxy.alert(data.msg);
					}
		  		},
		  		error:function(msg){
			  		alert("Ajax error status: "+msg.status);
			    }
			});

		});

		$('.nactivePreviewClass').live('click',function(e){
			console.log('aaa')
			var wMax = '800px', hMax = '500px';
			var str = '<img src=' + $(this).attr('data-img') + ' style="max-width:' + wMax + '; max-height:' + hMax + '" />';
			new Boxy('<div class="boxy">' + str + '</div>',
		        {
		            title:'原生广告预览',        //标题
		            autoWidth:true,
		            closeText:"X",            //关闭文字
		            modal:true,        //背景是否变暗
		            fixed:true,        //窗口是否固定
		            cache:true,        //是否被遮挡
		            draggable:true,      //这个设定窗口是否可以拖动，要定义title才有效，设定了modal就无效
		            center:true        //弹出对话框是否居中
		        });
		})

		$('a.creativePreviewClass').live('click',function(e){
		    var src = $(this).attr('_id');
		    var width = $(this).attr('_width');
		    var height = $(this).attr('_height');
		    var link = $(this).attr('_link');
		    var publishertype = $(this).attr('_publishertype');
		    ty = src.split(".");
		    len = ty.length;
		    type = ty[len-1];
		    var match = /^(http)|(https):\/\/.+/i;
		    if(!src.match(match)) {
		        src = '/global/custom/view?type=previewCreative&imagePath=' + encodeURIComponent(src);
		    } else if($('a.bannerTabActive').attr('_publishertype') == 'exchage') {
		    	src += '?mvpubtype=dsp';
		    }
		    type = type.toLowerCase();
		    if(type == 'gif' || type == 'jpg'|| type == 'jpeg'|| type == 'bmp'|| type == 'png') {
		        var htmlSrc = '<a href="/global/custom/direct?url='+ encodeURIComponent(link) +'" target="_blank"><img src="' + src + '" height="'+height+'" width="'+width+'" frameborder="no" border=0 marginwidth="0" marginLeft="50" marginheight="10" scrolling="no" allowtransparency="yes"/></a>';
		    } else if (type == 'swf' || type == 'flv') {
		        //var htmlSrc = '<embed id="6511_swf" height="'+height+'" width="'+width+'" src="'+src+' " quality="High" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" wmode="opaque allowscriptaccess="always" FlashVars=""></embed>';
			    if(publishertype == 'exchange')
			    	var flashVars = "LoopFlag=30";
			    else
			    	var flashVars = "";
		    	var htmlSrc = "<div style=''><div style='position: relative; z-index: 1; width:" + width
		        + "px; height:"+ height +"px'><div style='position: absolute; left: 0pt; top: 0pt; z-index: 2; width:"+width
		        + "px; height:"+ height +"px;'><OBJECT id='' codeBase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7' classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 width='" + width
		        + "' height='"+ height +"' type=application/x-shockwave-flash><PARAM NAME='AllowFullScreen' VALUE='false'><PARAM NAME='WMode' VALUE='transparent'>"
		        + "<param value='"+ flashVars +"' name='FlashVars'>"
		        + "<PARAM NAME='Movie' VALUE='"+ src +"'><embed id='6511_swf' flashvars='"+ flashVars +"' height='" + height + "' width='" + width + "' src='" + src
                + "' quality='High' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' wmode='transparent' allowscriptaccess='always' FlashVars=''></embed></OBJECT>"
                + "</div><a id='mvclicka' class=''  href='/global/custom/direct?url="+ encodeURIComponent(link) +"' target='_blank' ><img border='0' style='position: absolute; left: 0px; top: 0px; z-index: 3; width:"+ width +"px;height:"+ height +"px;' src='http://static.mediav.com/1x1.gif'/></a></div></div>";
		    } else if (type == 'html') {
		    	var htmlSrc = '<iframe src="' + src + '" height="'+height+'" width="'+width+'"  frameborder="no"></iframe>';
		    }
		    new Boxy('<div class="boxy">'+ htmlSrc +'</div>',
		        {
		            title:oLang.creative_preview,        //标题
		            autoWidth:true,
		            closeText:"X",            //关闭文字
		            modal:true,        //背景是否变暗
		            fixed:true,        //窗口是否固定
		            cache:true,        //是否被遮挡
		            draggable:true,      //这个设定窗口是否可以拖动，要定义title才有效，设定了modal就无效
		            center:true        //弹出对话框是否居中
		        });

		});
		//搜索功能
		$('#btn_search').click(function() {
			retrieveAdver(null, mvgrid.getSize());
		});
		$('#searchword').bind('keypress', function(evt) {
            var key = evt.which || evt.keyCode;
            if (key == 13) {
                pagesize = mvgrid.getSize();
                retrieveAdver(1,pagesize);
            }
		});
		$('#clearselect').click(function(){
            var searchField = $('#searchField');
            searchField.val(searchField.children()[0].value);
            $('#searchword').val('');
            $('#displayType').val('all');
            $('#creativeSource').val('all');
			$('#status').val('0');
			$('#dealFlag').val('0');
			//$('#advertiserid').val('all');
			$('#creativetype').val('all');
			$('#sizeid').val('');
			$('#pubAuditStatus').val('');
			$('#bannerUniq').attr('checked', false);
			retrieveAdver(null, mvgrid.getSize());
		});
		var oBannerClickBoxy = {};
		$('a.showBannerClick').live('click',function(e){
			var bannerid = $(this).attr('_id');
			var boxyname = $(this).attr('_boxyname');
			if ("" == bannerid || typeof(oBannerId2Info[bannerid]) == undefined || typeof(oBannerId2Info[bannerid]) == undefined) {
				return false;
			} else {
				var aHtml = new Array();
				aHtml[aHtml.length] = '<div class="mvgrid" style="width:430px;height:260px;overflow:auto">';
				aHtml[aHtml.length] = '<table class="grid" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">';
				aHtml[aHtml.length] = '<col width="35%"/>';
				aHtml[aHtml.length] = '<col width="65%"/>';
				aHtml[aHtml.length] = '<thead>';
				aHtml[aHtml.length] = '<tr class="mvgridth">';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="name">标签名</th>';
				aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="advertisername">地址</th>';
				aHtml[aHtml.length] = '</tr>';
				aHtml[aHtml.length] = '</thead>';
				aHtml[aHtml.length] = '<tbody>';
				for(var i = 0; i < oBannerId2Info[bannerid]['banner_click'].length; i++) {
					aHtml[aHtml.length] = '<tr class="">';
					aHtml[aHtml.length] = '<td align="left">'+ oBannerId2Info[bannerid]['banner_click'][i].name +'</td>';
					aHtml[aHtml.length] = '<td align="left"><a href="/global/custom/direct?url='+ encodeURIComponent(oBannerId2Info[bannerid]['banner_click'][i].link) +'"  target="_blank">'+ oBannerId2Info[bannerid]['banner_click'][i].link +'</a></td>';
					aHtml[aHtml.length] = '</tr>';
				}
				aHtml[aHtml.length] = '</tbody>';
				aHtml[aHtml.length] = '</table></div>';
				oBannerClickBoxy =  new Boxy('<div class="boxy" style="width:430px;height:280px">' + aHtml.join("") + '</div>', {
				        title:boxyname,        //标题
				        autoWidth:true,
				        closeText:"X",            //关闭文字
				        modal:true        //背景是否变暗
				});
			}
		});
		oAuditingHistoryBoxy = {};
		$('a.auditinghistory').live('click',function(e){
			var bannerid = $(this).attr('_id');
			var aHtml = new Array();
            aHtml[aHtml.length] = '<div class="mvgrid" style="width:430px;height:260px;overflow:auto">';
            aHtml[aHtml.length] = '<p>创意ID ' + bannerid + '</p>';
			aHtml[aHtml.length] = '<table class="grid" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">';
			aHtml[aHtml.length] = '<col width="45%"/>';
			aHtml[aHtml.length] = '<col width="35%"/>';
			aHtml[aHtml.length] = '<col width="20%"/>';
			aHtml[aHtml.length] = '<thead>';
			aHtml[aHtml.length] = '<tr class="mvgridth">';
			aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="name">操作人</th>';
			aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="time">操作时间</th>';
			aHtml[aHtml.length] = '<th nowrap="nowrap" align="left" rel="logs">操作记录</th>';
			aHtml[aHtml.length] = '</tr>';
			aHtml[aHtml.length] = '</thead>';
			aHtml[aHtml.length] = '<tbody ID="auditingHistoryTbody">';
			aHtml[aHtml.length] = '</tbody>';
			aHtml[aHtml.length] = '</table></div>';
			oAuditingHistoryBoxy =  new Boxy('<div class="boxy" style="width:430px;height:280px">' + aHtml.join("") + '</div>', {
			        title:'审核记录',   //标题
			        autoWidth:true,
			        closeText:"X",     //关闭文字
			        modal:true,       //背景是否变暗
                    draggable: true
			});
			$.ajax({
				url:"/auditing/banner/view?type=getAuditingtHistory",
			  	type:"post",
			  	dataType:"html",
			    context:$(this),
			    data:'bannerid=' + bannerid,
			    success:function(data){
					$("#auditingHistoryTbody").html(data);
		  		},
		  		error:function(msg){
			  		alert("Ajax error status: "+msg.status);
			    }
			});
		});

		$('a.bannerTabClass').click(function(e){
			$('a.bannerTabClass').removeClass('bannerTabActive');
			$(this).addClass('bannerTabActive');
			resetSize();
			retrieveAdver(1, mvgrid.getSize());
		});

		function resetSize() {
			var publihsertype = $('a.bannerTabActive').attr('_publishertype');
			var oSize = oSizeId2Name[publihsertype];
			var aHtml = new Array();
			for(key in oSize) {
				aHtml[aHtml.length] = "<option value='"+ key +"'>"+ oSize[key] +"</option>";
			}
			aHtml = aHtml.sort(fCmpSizeBySizeName);
			aHtml.unshift("<option value=''>全部尺寸</option>");
			$('select#sizeid').html(aHtml.join(''));
		}

		function fCmpSizeBySizeName(sVal1,sVal2){
			var iVal1 = sVal1.indexOf('>');
			var iVal2 = sVal2.indexOf('>');
			sVal1 = sVal1.substr(iVal1+1);
			sVal2 = sVal2.substr(iVal2+1);
			return sVal1.localeCompare(sVal2);
		}

		//个性化重定向创意预览
        $('a.pr_creativePreviewClass').live('click',function(e){
            var bannerid = $(this).attr('_bannerid');
            var src = dynamicpreviewurl + '?bannerid='+bannerid;
            var width = $(this).attr('_width');
            var height = $(this).attr('_height');
            var iframewidth = parseInt(width)+4;
            var iframeheight = parseInt(height)+4;
            var htmlSrc = '<iframe src="' + src + '" height="'+iframeheight+'" width="'+iframewidth+'"  frameborder="no"></iframe>';
            new Boxy('<div class="boxy">'+ htmlSrc +'</div>',
                {
                    title:'素材预览',        //标题
                    autoWidth:true,
                    closeText:"X",            //关闭文字
                    modal:true,        //背景是否变暗
                    fixed:true,        //窗口是否固定
                    cache:true,        //是否被遮挡
                    draggable:true,      //这个设定窗口是否可以拖动，要定义title才有效，设定了modal就无效
                    center:true        //弹出对话框是否居中
                });
        });
	});
 })(jQuery);



