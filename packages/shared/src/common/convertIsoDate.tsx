import moment from "moment";

export const convertToISODate = (dateString) =>{
    const originalDate = new Date(dateString);
    originalDate.setDate(originalDate.getDate() - 1);
    originalDate.setUTCHours(15, 0, 0, 0);
    const isoDate = originalDate.toISOString().slice(0,-5) + 'Z';

    return isoDate;
}

export const convertToDateTime = (isoTimes) => {
    return moment(isoTimes).format('YYYY-MM-DD')
}

export const convertIsoTimeToMMSSHH = (isoTimes) => {
    return moment(isoTimes).format('HH:mm:ss');
}