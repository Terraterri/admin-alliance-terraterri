import { masterClient, expoAdminClient } from './httpClient';
const handleImages3 = async (e) => {
  let formData = new FormData();
  formData.append('file', e.target.files[0]);
  try {
    let res = await expoAdminClient.post('imageConfig/upload_to_gcs.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('res', res);
    return { clientStatus: true, data: res.data };
  } catch (error) {
    return { clientStatus: false, data: error };
  }
};

export { handleImages3 };
