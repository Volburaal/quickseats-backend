import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAvailableRide = async (req, res) => {
  console.log(req.body)
  const { destination, at, vacancy} = req.body;
  const {userId: driverId} = req.user

  if (!destination || !at || !vacancy) {
    return res.status(400).json({ message: 'Destination, time, vacancy, and driverId are required.' });
  }

  try {
    const availableRide = await prisma.availableRide.create({
      data: {
        destination,
        at,
        vacancy,
        driverId,
      },
    });

    return res.status(201).json({ message: 'Available ride created successfully', availableRide });
  } catch (error) {
    console.error('Error creating available ride:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableRides = async (req, res) => {

  try {
    let availableRides = await prisma.availableRide.findMany({
      include:{driver: true}
    });

    return res.status(200).json(availableRides);
  } catch (error) {
    console.error('Error fetching available rides:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const modifyAvailableRide = async (req, res) => {
  const { id } = req.params;
  const { destination, at, vacancy } = req.body;

  try {
    const updatedRide = await prisma.availableRide.update({
      where: { id: parseInt(id) },
      data: {
        destination: destination || undefined,
        at: at || undefined,
        vacancy: vacancy || undefined,
      },
    });

    return res.status(200).json({ message: 'Available ride updated successfully', updatedRide });
  } catch (error) {
    console.error('Error updating available ride:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAvailableRide = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.availableRide.delete({
      where:{id:parseInt(id)}
    })

    return res.status(201).json({ message: 'Available ride created successfully'});
  } catch (error) {
    console.error('Error creating available ride:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createIncomingRide = async (req, res) => {
  const { destination, user } = req.body;
  const driverId = user.userId

  if (!destination || !driverId) {
    return res.status(400).json({ message: 'Destination and driverId are required.' });
  }

  try {
    const incomingRide = await prisma.incomingRide.create({
      data: {
        destination,
        driverId,
      },
    });

    return res.status(201).json({ message: 'Incoming ride created successfully', incomingRide });
  } catch (error) {
    console.error('Error creating incoming ride:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getIncomingRides = async (req, res) => {

  try {
    const incomingRides = await prisma.incomingRide.findMany({
      include:{driver: true}
    });

    return res.status(200).json(incomingRides);
  } catch (error) {
    console.error('Error fetching incoming rides:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteIncomingRide = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.incomingRide.delete({
      where:{id: parseInt(id)}
    })

    return res.status(201).json({ message: 'Incoming ride created successfully'});
  } catch (error) {
    console.error('Error creating available ride:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};