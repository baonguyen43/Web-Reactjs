const columnConfig = (config) => {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên bài học',
            dataIndex: 'lesson',
            width: '45%',
            filters: config.filters,
            onFilter: (value, record) => {
                return record.lesson.indexOf(value) === 0
            },
            sorter: (a, b) => (a.lesson < b.lesson) - (a.lesson > b.lesson),

        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            render: (value) => config.rating(value / 20)
        },
        {
            title: 'Hoàn thành',
            dataIndex: 'progress',
            render: (value) => config.progess(value),
            width: '45%',
        },
        {
            title: '',
            dataIndex: '#',
            render: (value, record) => config.button(record),
            width: '10%',
        }
    ];
    return columns
}

export default columnConfig;