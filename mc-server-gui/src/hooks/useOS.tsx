export default function useOS() {
  const os = navigator.userAgent;
  let userOS = '';

  if (os.search('Mac') !== -1) {
    userOS = 'MacOS';
  } else {
    userOS = 'Windows';
  }

  return { userOS };

}
