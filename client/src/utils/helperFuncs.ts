export const pathForPicture = (path: string): string => `http://localhost:3001/${path.split("public\\")[1].split("\\").join('/')}`;

export const dateToString = (date: Date): string => {
    const monthAbbreviations: string[] = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const dates: string[] = date.toString().split("T")[0].split("-");
    const dateString: string = `${dates[2]} ${monthAbbreviations[parseInt(dates[1])-1]}, ${dates[0]}`
    return dateString;
}