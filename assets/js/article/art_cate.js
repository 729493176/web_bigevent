$(function() {
    var form = layui.form;
    initArtCateList()

    // 获取文章列表并渲染到页面中
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
            }
        })
    }

    // 给添加类别绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#add').html()
        });
    })

    // 通过代理的方式为form表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })

    })

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新列表失败');
                }
                layer.msg('更新成功');
                layer.close(indexEdit);
                initArtCateList()
            }
        })
    })
    var indexRemove = null;
    $('tbody').on('click', '.btn-remove', function() {
        var id = $(this).attr('data-id');
        indexRemove = layer.open({
            title: '提示',
            content: '确定删除？',
            yes: function() {
                $.ajax({
                    method: 'get',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败')
                        }
                        layer.msg('删除成功');
                        initArtCateList()
                        layer.close(indexRemove);
                    }
                })
            }
        });
    })
})