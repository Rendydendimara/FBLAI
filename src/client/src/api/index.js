import Axios from 'axios';
import { BACKEND_URL } from '../constant';
import fileDownload from 'js-file-download';


export const ApiPost = async ({ subject, file }) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("subject", subject);

  const response = await Axios.post(
    `${BACKEND_URL}/post-file/`, formData)
    .then((response) => {
      // fileDownload(
      //   response.data.dataFound,
      //   `${new Date().getTime().toString()}-data.zip`
      // );
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  if (response) {
    return response;
  } else {
    return {
      status: 500,
      data: {
        message: 'Server error. Silakan hubungi admin',
      },
    };
  }
}
