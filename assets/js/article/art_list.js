$(function() {
    var form = layui.form
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };

    initTable();
    initSelect();
    // 渲染文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    //渲染选择下拉菜单
    function initSelect() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取下拉菜单中的内容
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数赋值
        q.cate_id = cate_id
        q.state = state
            // 重新渲染
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 4, 5],
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }


    // 删除功能
    $('tbody').on('click', '#btn-del', function() {
        var len = $('#btn-del').length
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }

                    if (len === 1) {
                        // 如果已经是第一页了 就不能再减了 不然发请求pagenum=-1会请求失败
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    layer.msg('删除成功')
                    initTable();
                }
            })
            layer.close(index)
        });

    })




    // 定义美化事件过滤器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        }
        //定义补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
})