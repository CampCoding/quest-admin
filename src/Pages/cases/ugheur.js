{
    const handleBlur = async (video_id, video_number) => {
        set_video_id(null);
        setArrangeNumber(video_id, video_number);
    };

    const handleFocus = () => {
        setCurrentNumber(cell.cell.row.original?.video_number);
        set_video_id(cell.cell.row.original?.video_id);
    };

    const handleClick = () => {
        set_video_id(cell.cell.row.original?.video_id);
    };

    return (
        <div
            style={{ width: "fit-content", cursor: "pointer" }}
            onClick={handleClick}
        >
            <input
                style={{ width: "120px", cursor: "pointer" }}
                type="text"
                onChange={(e) =>
                    setVideoData({ id: cell.cell.row.original?.video_id, number: e.target.value })
                }
                onFocus={() => handleFocus()}
                defaultValue={
                    videoData?.id == cell.cell.row.original?.video_id
                        ? videoData?.number
                        : cell.cell.row.original?.video_number
                }
                value={
                    videoData?.id == cell.cell.row.original?.video_id
                        ? videoData?.number
                        : cell.cell.row.original?.video_number
                }
                disabled={loader}
                className={
                    video_id === cell.cell.row.original?.video_id
                        ? "MR_input_form_element active"
                        : "MR_input_form_element lazy"
                }
                onBlur={async (e) => {
                    await handleBlur(cell.cell.row.original?.video_id, e.target.value);
                }}
            />
        </div>
    );
}