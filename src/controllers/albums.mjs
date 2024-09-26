import AlbumModel from '../models/album.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumModel);

    this.run();
  }

  getAlbums() {
    this.app.get('/albums', (req, res) => {
      this.AlbumModel.find().populate('photos').exec()
        .then((albums) => res.status(200).json(albums || []))
        .catch((err) => {
          console.error(`[ERROR] albums -> ${err}`);
          res.status(500).json({ code: 500, message: 'Internal Server error' });
        });
    });
  }

  getAlbum() {
    this.app.get('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  postAlbum() {
    this.app.post('/album', (req, res) => {
      try {
        const album = new this.AlbumModel(req.body);

        album.save().then(() => {
          res.status(201).json(album);
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  putAlbum() {
    this.app.put('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        ).then((album) => {
          res.status(200).json(album);
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  deleteAlbum() {
    this.app.delete('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).then(() => {
          res.status(204).json({
            code: 204,
            message: 'The album has been deleted'
          });
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.getAlbums();
    this.getAlbum();
    this.postAlbum();
    this.putAlbum();
    this.deleteAlbum();
  }
};

export default Albums;
