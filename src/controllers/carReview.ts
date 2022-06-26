export function reviewController(reviews: any[], newReview: any) {
	const reviewIndex = reviews.findIndex((el) => el.id === newReview.id);
	if (reviewIndex === -1) {
		reviews.push(newReview);
	} else {
		reviews[reviewIndex] = {
			...reviews[reviewIndex],
			...newReview,
		};
	}
	return reviews;

    
}