(function () {
    var base = {
        summernote: function (selector, opts) {
            opts = opts || {};
            setTimeout(function () {
                $(selector).summernote({
                    height: opts.height || 600,
                    toolbar: opts.toolbar || [
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['misc', ['picture', 'codeview', 'undo', 'redo']],
                    ],
                });
            }, 150);
        },
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        }
    };
    window._g = base;
})();