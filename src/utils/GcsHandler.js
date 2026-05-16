import { expoAdminClient } from './httpClient';
const handleImageGcs = async (e) => {
  let formData = new FormData();
  formData.append('file', e.target.files[0]);
  try {
    let res = await expoAdminClient.post('imageConfig/upload_to_gcs.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { clientStatus: true, data: res.data };
  } catch (error) {
    return { clientStatus: false, data: error };
  }
};

const handleBrochureGcs = async (e) => {
  let formData = new FormData();
  formData.append('file', e.target.files[0]);
  try {
    let res = await expoAdminClient.post('imageConfig/uploadBrochure.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { clientStatus: true, data: res.data };
  } catch (error) {
    return { clientStatus: false, data: error };
  }
};

export { handleImageGcs, handleBrochureGcs };
