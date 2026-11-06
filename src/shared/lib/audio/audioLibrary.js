const assets = new Map();

export const audioLibrary = {
  register(projectId, asset) {
    if (!projectId || !asset) return;
    const previous = assets.get(projectId);
    if (previous?.url && previous.url !== asset.url) URL.revokeObjectURL(previous.url);
    assets.set(projectId, asset);
  },
  get(projectId) {
    return assets.get(projectId) || null;
  },
  remove(projectId) {
    const asset = assets.get(projectId);
    if (asset?.url) URL.revokeObjectURL(asset.url);
    assets.delete(projectId);
  }
};
