interface infoImage {
  type: string;
  name: string | undefined;
}

export default function getInfoImage(uri: string): infoImage {
  const filename = uri.split('/').pop();

  const match = /\.(\w+)$/.exec(filename as '');

  const type = match ? `image/${match[1]}` : `image`;

  return {
    name: filename,
    type,
  };
}
