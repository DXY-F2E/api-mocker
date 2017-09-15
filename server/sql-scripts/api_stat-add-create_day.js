// mongo v3.4

db.apistats.aggregate(
  [
    { $addFields: {
      createDay: { $dateToString: { format: '%Y-%m-%d', date: '$createTime' } }
    } },
        { $out: 'apistats' }
  ]
)
