const Card = require('../models/card');
const NotFoundError = require('../status/NotFoundError');
const ForbiddenError = require('../status/ForbiddenError');
const BadRequestError = require('../status/BadRequestError');
const { STATUS_CREATED } = require('../status/status');

function getCard(req, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function postCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(
      new NotFoundError(
        'Карточка с указанным _id не найдена',
      ),
    )
    .then((card) => {
      if (String(card.owner._id) !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      } else {
        Card.findByIdAndRemove(String(req.params.cardId))
          .then((result) => {
            res.send({ data: result });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              return next(new BadRequestError('Введены некорректные данные'));
            }
            return next(err);
          });
      }
    })
    .catch(next);
}

function putLike(req, res, next) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      return next(new NotFoundError('Передан несуществующий _id карточки'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }

      next(err);
    });
}

function deleteLike(req, res, next) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      return next(new NotFoundError('Передан несуществующий _id карточки'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }

      next(err);
    });
}

module.exports = {
  getCard,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
