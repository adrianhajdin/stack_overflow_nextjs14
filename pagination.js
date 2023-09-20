const { searchQuery, filter, page = 1, pageSize = 2 } = params;
    const skipAmount = (page - 1) * pageSize;
    .skip(skipAmount)
    .limit(pageSize)
    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };