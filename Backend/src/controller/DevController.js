const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index - mostrar uma lista
// show - mostrar um unico registro
// store - criar
// update - alterar
// destroy - deletar

module.exports = {
    async index(req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store (req, res){
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({github_username})

        if(!dev){
                const responseGithub = await axios.get(`https://api.github.com/users/${github_username}`)
            
                const { name = login, avatar_url, bio } = responseGithub.data;
            
                const techsArray = parseStringAsArray(techs);
            
                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                };
            
                dev = await Dev.create({
                    name,
                    github_username,
                    bio,
                    avatar_url,
                    techs: techsArray,
                    location
                })

                return res.json(dev);
        }
        return res.status(400).json({
            menssage: "Dev já cadastrado!"
        });
    }
};