import { fetcher, pdfToJPG, removeFile } from '../api';

const access = ['pdf', 'image'];
//
export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
// convert pdf to image
export const fileToImgUrl = async (file, entityId, userId) => {
  if (!file) return {};
  const isImageOrPDF = access.some(x => file.type.includes(x));
  if (!isImageOrPDF) return {};
  const guid = '65ff2053-ef2d-4e42-af9d-70d4888686b4';
  const fetched = await fetcher(guid);
  if (fetched[0]?.id) {
    await removeFile(fetched[0].id);
  }
  const imgObject = await pdfToJPG(file, entityId, userId);
  return imgObject;
};
