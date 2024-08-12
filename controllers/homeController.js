module.exports.Homepage = async (req, res) => {
    res.render('home',{title: "ServiceAuto-HomePage"}); // Ensure 'home' is the correct view file
};
