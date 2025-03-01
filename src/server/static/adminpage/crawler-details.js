/*
* crawler details module javascript file
*/

const CrawlerDetails = ( () => {
    // 모듈 변수 선언
    let _hot;
    let _detail_list = [['N/A', 'N/A']];
    const _display_data_list = [
        'server_name', 
        'crawling_state', 
        'percentage',
        'start_time',
        'end_time',
        'infra_state',
        'total_passes',
        'total_passes_per_substance',
        'processed_passes',
        'total_substances',
        'processed_substances',
        'total_factsheets'
    ];

    function set_crawler_details(crawler_details) {
        let _selected_data = _select_display_data(crawler_details);
        console.log(_selected_data)
        _detail_list = _selected_data;
    }

    function display_data() {
        if (_hot) {
            _hot.loadData(_detail_list);
        }
    }

    function _select_display_data(obj) {
        return _display_data_list.map(key => key in obj ? [key, obj[key]] : 'N/A');
        //return _display_data_list.map(key => (key in obj ? obj[key] : 'N/A'));
    }

    function _cells_ht(row, col) {
        let cellProp = {};
        cellProp.className = 'htCenter';
        return cellProp;
    }

    function _on_cell_mouse_up_ht(event, coords, tag) {
        const crawler_id = _detail_list[coords.row][0];
        const crawler_name = _detail_list[coords.row][1];
    }

    function _init(_hot_id) {
        // HandsonTable Place Holder Tag element 가져오기
        const container = document.getElementById(_hot_id);

        // Diff HandsonTable 생성
        _hot = new Handsontable(container, {
            data: _detail_list,
            rowHeaders: true,
            width: "100%",
            height: "120pt",
            stretchH: 'all',
            currentRowClassName: "currentRow",
            outsideClickDeselects: false,
            manualColumnResize: true,
            colWidths: [100, 120],
            colHeaders: function (col) {
                switch (col) {
                    case 0:
                        return "<b>속성</b>";
                    case 1:
                        return "<b>값</b>";
                }
            },
            cells: _cells_ht,
            afterOnCellMouseUp: _on_cell_mouse_up_ht,
            licenseKey: 'non-commercial-and-evaluation'
        });
    }

    document.addEventListener("DOMContentLoaded", function(){_init("crawler-details")});

    function fetch_and_display_data(crawler_id) {
        const _detail_list = CrawlerList.get_crawler_detail(crawler_id);
        console.log('fetch_and_display_data: ' + crawler_id);
        console.log(_detail_list);
        set_crawler_details(_detail_list);
        display_data();
    }

    const _exports = {
        set_crawler_details,
        display_data,
        fetch_and_display_data,
    };

    return _exports;

} )();