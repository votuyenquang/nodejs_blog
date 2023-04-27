const Course = require('../models/Course');
const {mongooseToObject } = require('../../util/mongoose');
class CourseController {

    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({slug: req.params.slug})
            .then((course) => {
                res.render('courses/show', {  course : mongooseToObject(course) });
            })
            .catch((err) => {
                
            });
    }
    //Get courses/create
    create(req, res, next) {
        res.render('courses/create')
    }


    // [POST] /courses/create
    store(req, res, next) {
        req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/hq720.jpg`;  
        const course = new Course(req.body);
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch((err) => {

            });
     
    }
    // [GET] /courses/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then( course => res.render('courses/edit',{
                    course: mongooseToObject(course)
                }))
            .catch(next);
        
    }
     // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next); 
    }

     // [DELETE] /courses/:id
    delete(req, res, next) {
        Course.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);

    }

    // [DELETE] /courses/:id/force
    forceDelete(req, res, next) {
        Course.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);

    }
    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }
    handleActionForm(req, res, next){

       switch(req.body.options){
            case 'delete' :
                Course.delete({_id: req.body.courseIds})
                    .then(() => res.redirect('back'))
                    .catch(next);
           
                break;
            default: 
                res.json({message: "Request is invalid"})
       }
        
        
    }
    async handleActionTrashForm(req, res, next){
        switch(req.body.options){
            case 'delete-force' :
                try {
                  const result =  await Course.deleteMany({_id: req.body.courseIds})
                  if(result) return res.redirect('back')
                } catch (error) {
                    console.log(error);
                }
                
                // Course.deleteOne({_id: req.body.courseIds})
                //     .then(() => res.redirect('back'))
                //     .catch(next);
                //    res.json(req.body)
              
                break;
            case 'restore-all' :
                Course.restore({_id: req.body.courseIds})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            
            default :  res.json({message: "Request is invalid"});
        }
    }

}


module.exports = new CourseController;
