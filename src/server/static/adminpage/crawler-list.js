/*
* crawler list module javascript file
*/

const CrawlerList = ( () => {
    // 모듈 변수 선언
    let _hot;
    let _crawler_list;
    let _crawler_full_list;
    let _currrent_selected_row;
    let _update_interval;
    const _display_data_list = ['', 'server_name', 'crawling_state', 'percentage'];

    function set_crawler_list(crawler_full_list) {
        let _selected_data = crawler_full_list.map(_select_display_data);
        for(let i = 0; i < _selected_data.length; i++){
            _selected_data[i][0] = i;
        }
        _crawler_list = _selected_data;
        _crawler_full_list = crawler_full_list;
        console.log('set_crawler_list() makes: ', _selected_data);
    }

    function get_crawler_detail(crawler_id = -1){
        //crawler 세부 정보를 반환. 
        //기본값으로 전체 리스트를 반환, 정수를 넣으면 해당 인덱스의 정보를 반환. 
        if (crawler_id == -1){
            return _crawler_full_list;
        }
        return _crawler_full_list[crawler_id];
    }

    function display_data() {
        if (_hot) {
            _hot.loadData(_crawler_list);
        }
    }

    function _select_display_data(obj) {
        return _display_data_list.map(key => (key in obj ? obj[key] : 'N/A'));
    }

    function _cells_ht(row, col) {
        let cellProp = {};
        cellProp.className = 'htCenter';
        return cellProp;
    }

    function _on_cell_mouse_up_ht(event, coords, tag) {
        _currrent_selected_row = coords.row;
        _display_detail_data();
    }

    function _init(_hot_id) {
        // HandsonTable Place Holder Tag element 가져오기
        const container = document.getElementById(_hot_id);

        // Diff HandsonTable 생성
        _hot = new Handsontable(container, {
            data: _crawler_list,
            rowHeaders: true,
            columns: [
                {type: "text", readOnly: true},
                {type: "text", readOnly: true},
                {type: "text", readOnly: true},
                {type: "text", readOnly: true}
            ],
            width: "100%",
            height: "120pt",
            stretchH: 'all',
            currentRowClassName: "currentRow",
            outsideClickDeselects: false,
            manualColumnResize: true,
            colWidths: [0, 120, 100, 30],
            hiddenColumns: {
                columns: [0],  // 0번 인덱스 컬럼 숨기기
            },
            colHeaders: function (col) {
                switch (col) {
                    case 0:
                        return "";
                    case 1:
                        return "<b>크롤러 이름</b>";
                    case 2:
                        return "<b>크롤러 상태</b>";
                    case 3:
                        return "<b>진행률</b>";
                }
            },
            cells: _cells_ht,
            afterOnCellMouseUp: _on_cell_mouse_up_ht,
            licenseKey: 'non-commercial-and-evaluation'
        });
        //_setup_buttons_event_listener(); 버튼을 추가한다면 필요
    }

    document.addEventListener("DOMContentLoaded", function(){_init("crawler-list")});

    function fetch_and_display_data() {
        _ajax_get_crawler_list().then(_display_detail_data);
        AllCrawlerDetails.fetch_and_display_data();
        console.log("폴링 요청 성공");
    }

    function _display_detail_data(){
        const crawler_id = _crawler_list[_currrent_selected_row][0];
        const crawler_name = _crawler_list[_currrent_selected_row][1];
        document.getElementById('current-crawler-name').textContent = crawler_name;
        CrawlerDetails.fetch_and_display_data(crawler_id);
    }

    function fetch_and_display_state(){
        _currrent_selected_row = 0;
        _update_interval = setInterval(fetch_and_display_data, 1000);
        _select_first_Row();
    }

    function _select_first_Row(){
        if (_hot){
            _hot.selectRows(0);
        }
        else{
            setTimeout(_select_first_Row, 100);
        }
    }

    function _ajax_get_crawler_list() {
        return $.ajax({
            url: window.location.protocol +"//"+ window.location.host + "/groups/",
            type: "POST",
            data: {
                csrfmiddlewaretoken: g_csrf_token,
                cmd: "poll-controller",
            },
            success: function(res) {
                console.log(res);
                if ('result' in res && res.result) {
                    const data = res.data || {};
                    console.log(data) // 데이터 한번 찍어봄
                    _crawler_full_list = data.extended_crawler_state_list || [];
                    
                    // 서버로부터 받은 새로운 크롤링 리스트로 업데이트
                    set_crawler_list(_crawler_full_list);
                    display_data();
                } else {
                    const error = res.error || {};
                    alert(error.message);
                }
            },
            error: function(xhr, errmsg, err) {
                console.error(xhr.status + ": " + xhr.responseText);
                alert('크롤러 리스트 가져오기 중 오류가 발생했습니다.');
            }
        });
    }

    const _exports = {
        set_crawler_list,
        get_crawler_detail,
        display_data,
        fetch_and_display_data,
        fetch_and_display_state,
    };

    return _exports;

} )();