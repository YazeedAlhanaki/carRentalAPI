export function imageController(images: any[], newImage: any) {
	const imageIndex = images.findIndex((el) => el.id === newImage.id);
	if (imageIndex === -1) {
		images.push(newImage);
	} else {
		images[imageIndex] = {
			...images[imageIndex],
			...images,
		};
	}
	return images;

    
}